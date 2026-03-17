"""
Service layer for business logic
"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import pandas as pd
from typing import Dict, List, Optional, Tuple

from app.models.db import (
    Worker, Subscription, InsurancePlan, Claim, Payout,
    DisruptionEvent, EnvironmentalData, ZoneThreshold,
    ClaimStatus, PaymentStatus, RiskLevel
)
from app.schemas.schemas import (
    WorkerCreate, SubscriptionCreate, ClaimCreate,
    RiskAssessmentRequest, RiskAssessmentResponse,
    RiskLevelSchema
)
from app.ml.models import risk_model, fraud_model
from app.core.config import settings


class WorkerService:
    """Service for worker operations"""
    
    @staticmethod
    def create_worker(db: Session, worker_data: WorkerCreate) -> Worker:
        """Create new worker"""
        db_worker = Worker(**worker_data.dict())
        db.add(db_worker)
        db.commit()
        db.refresh(db_worker)
        return db_worker
    
    @staticmethod
    def get_worker(db: Session, worker_id: int) -> Optional[Worker]:
        """Get worker by ID"""
        return db.query(Worker).filter(Worker.id == worker_id).first()
    
    @staticmethod
    def get_worker_by_user_id(db: Session, user_id: str) -> Optional[Worker]:
        """Get worker by user_id"""
        return db.query(Worker).filter(Worker.user_id == user_id).first()
    
    @staticmethod
    def list_workers(db: Session, zone: Optional[str] = None, active: bool = True) -> List[Worker]:
        """List workers"""
        query = db.query(Worker).filter(Worker.active == active)
        if zone:
            query = query.filter(Worker.zone == zone)
        return query.all()


class SubscriptionService:
    """Service for subscription operations"""
    
    @staticmethod
    def create_subscription(db: Session, worker_id: int, plan_id: int) -> Subscription:
        """Create worker subscription to plan"""
        # Get plan details
        plan = db.query(InsurancePlan).filter(InsurancePlan.id == plan_id).first()
        if not plan:
            raise ValueError(f"Plan {plan_id} not found")
        
        # Create subscription
        now = datetime.utcnow()
        expiry = now + timedelta(days=plan.duration_days)
        
        subscription = Subscription(
            worker_id=worker_id,
            plan_id=plan_id,
            status="ACTIVE",
            premium_paid=plan.premium_amount,
            activation_date=now,
            expiry_date=expiry
        )
        
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
        return subscription
    
    @staticmethod
    def get_active_subscription(db: Session, worker_id: int) -> Optional[Subscription]:
        """Get active subscription for worker"""
        now = datetime.utcnow()
        return db.query(Subscription).filter(
            Subscription.worker_id == worker_id,
            Subscription.status == "ACTIVE",
            Subscription.expiry_date > now
        ).first()
    
    @staticmethod
    def is_worker_covered(db: Session, worker_id: int) -> bool:
        """Check if worker has active insurance coverage"""
        return SubscriptionService.get_active_subscription(db, worker_id) is not None


class RiskAssessmentService:
    """Service for risk assessment and disruption detection"""
    
    @staticmethod
    def assess_zone_risk(db: Session, zone: str, data: Dict) -> RiskAssessmentResponse:
        """
        Assess disruption risk for a zone
        
        Args:
            db: Database session
            zone: Zone identifier
            data: Environmental data dict with keys:
                - temperature, rainfall, aqi, traffic_index, delivery_demand
        
        Returns:
            RiskAssessmentResponse with risk_score, risk_level, triggered status
        """
        
        # Get zone thresholds
        zone_threshold = db.query(ZoneThreshold).filter(
            ZoneThreshold.zone == zone
        ).first()
        
        if not zone_threshold:
            # Default thresholds if zone not configured
            zone_threshold = ZoneThreshold(
                zone=zone,
                temperature_threshold=42,
                rainfall_threshold=80,
                aqi_threshold=300,
                traffic_threshold=0.85,
                delivery_drop_threshold=-50  # 50% drop
            )
        
        # Prepare data for model
        X = pd.DataFrame([{
            'temperature': data.get('temperature', 25),
            'rainfall': data.get('rainfall', 0),
            'aqi': data.get('aqi', 50),
            'traffic_index': data.get('traffic_index', 0.5),
            'delivery_demand': data.get('delivery_demand', 1.0),
            'zone': zone
        }])
        
        # Get risk prediction
        risk_score, risk_level, factors = risk_model.predict(X)
        
        # Check if environmental thresholds triggered
        env_triggered = (
            data.get('temperature', 0) > zone_threshold.temperature_threshold or
            data.get('rainfall', 0) > zone_threshold.rainfall_threshold or
            data.get('aqi', 0) > zone_threshold.aqi_threshold or
            data.get('traffic_index', 0) > zone_threshold.traffic_threshold
        )
        
        # Check if should trigger
        should_trigger = risk_score > settings.disruption_threshold and env_triggered
        
        return RiskAssessmentResponse(
            zone=zone,
            risk_score=risk_score,
            risk_level=RiskLevelSchema[risk_level],
            triggered=should_trigger,
            triggering_factors=factors
        )
    
    @staticmethod
    def create_disruption_event(
        db: Session, 
        zone: str, 
        risk_score: float, 
        risk_level: str,
        triggered_by: str,
        environmental_data: Dict
    ) -> DisruptionEvent:
        """Create disruption event record"""
        
        event = DisruptionEvent(
            zone=zone,
            event_timestamp=datetime.utcnow(),
            risk_score=risk_score,
            risk_level=RiskLevel[risk_level],
            environmental_trigger=True,
            activity_verification=environmental_data.get('activity_drop', 0) > 30,
            triggered_by=triggered_by,
            environmental_data=environmental_data
        )
        
        db.add(event)
        db.commit()
        db.refresh(event)
        return event


class ClaimService:
    """Service for claim operations"""
    
    @staticmethod
    def create_claim(db: Session, claim_data: ClaimCreate) -> Claim:
        """Create insurance claim"""
        
        claim = Claim(
            worker_id=claim_data.worker_id,
            subscription_id=claim_data.subscription_id,
            disruption_event_id=claim_data.disruption_event_id,
            status=ClaimStatus.PENDING,
            claim_amount=claim_data.claim_amount,
            estimated_income_loss=claim_data.claim_amount
        )
        
        db.add(claim)
        db.commit()
        db.refresh(claim)
        return claim
    
    @staticmethod
    def verify_claim(db: Session, claim_id: int) -> Tuple[bool, Dict, float]:
        """
        Verify claim through multiple checks
        
        Returns:
            (is_valid, fraud_details, fraud_score)
        """
        
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if not claim:
            return False, {"error": "Claim not found"}, 1.0
        
        # Get worker subscription
        subscription = db.query(Subscription).filter(
            Subscription.id == claim.subscription_id
        ).first()
        
        if not subscription:
            return False, {"error": "Subscription not found"}, 1.0
        
        # Prepare fraud detection data
        claim_data = {
            'claim_frequency': ClaimService._get_claim_frequency(db, claim.worker_id),
            'claim_amount_deviation': ClaimService._get_amount_deviation(db, claim),
            'time_since_subscription_days': (datetime.utcnow() - subscription.activation_date).days,
            'activity_consistency': 0.8,  # Will be enhanced with activity data
            'weather_verified': True,
            'gps_verified': True
        }
        
        # Run fraud detection
        fraud_score, is_fraud, fraud_details = fraud_model.predict(claim_data)
        
        # Update claim
        claim.fraud_score = fraud_score
        claim.fraud_checks = fraud_details
        
        if is_fraud:
            claim.status = ClaimStatus.REJECTED
            claim.verification_notes = "Fraudulent claim detected"
        else:
            claim.status = ClaimStatus.VERIFIED
            claim.verification_notes = "Claim verified successfully"
            claim.verified_by = "AI_FRAUD_DETECTOR"
        
        db.commit()
        
        return not is_fraud, fraud_details, fraud_score
    
    @staticmethod
    def _get_claim_frequency(db: Session, worker_id: int, days: int = 30) -> int:
        """Get number of claims in last N days"""
        since = datetime.utcnow() - timedelta(days=days)
        count = db.query(Claim).filter(
            Claim.worker_id == worker_id,
            Claim.created_at >= since
        ).count()
        return count
    
    @staticmethod
    def _get_amount_deviation(db: Session, current_claim: Claim) -> float:
        """Get standard deviation of claim amounts"""
        claims = db.query(Claim).filter(
            Claim.worker_id == current_claim.worker_id
        ).all()
        
        if len(claims) < 2:
            return 0.0
        
        amounts = [c.claim_amount for c in claims]
        mean = sum(amounts) / len(amounts)
        variance = sum((x - mean) ** 2 for x in amounts) / len(amounts)
        std_dev = variance ** 0.5
        
        if std_dev == 0:
            return 0.0
        
        return abs(current_claim.claim_amount - mean) / std_dev
    
    @staticmethod
    def approve_claim(db: Session, claim_id: int) -> Claim:
        """Approve claim for payout"""
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if claim:
            claim.status = ClaimStatus.APPROVED
            db.commit()
            db.refresh(claim)
        return claim
    
    @staticmethod
    def get_claim(db: Session, claim_id: int) -> Optional[Claim]:
        """Get claim by ID"""
        return db.query(Claim).filter(Claim.id == claim_id).first()
    
    @staticmethod
    def list_claims(db: Session, worker_id: int) -> List[Claim]:
        """List claims for worker"""
        return db.query(Claim).filter(Claim.worker_id == worker_id).all()


class PayoutService:
    """Service for payment operations"""
    
    @staticmethod
    def initiate_payout(db: Session, claim_id: int, recipient_phone: str) -> Payout:
        """Initiate payout for approved claim"""
        
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if not claim or claim.status != ClaimStatus.APPROVED:
            raise ValueError("Invalid claim for payout")
        
        payout = Payout(
            claim_id=claim_id,
            amount=claim.claim_amount,
            currency="INR",
            payment_status=PaymentStatus.INITIATED,
            recipient_phone=recipient_phone
        )
        
        db.add(payout)
        db.commit()
        db.refresh(payout)
        
        return payout
    
    @staticmethod
    def complete_payout(db: Session, payout_id: int, razorpay_transfer_id: str) -> Payout:
        """Mark payout as completed"""
        payout = db.query(Payout).filter(Payout.id == payout_id).first()
        if payout:
            payout.payment_status = PaymentStatus.COMPLETED
            payout.razorpay_transfer_id = razorpay_transfer_id
            payout.completed_at = datetime.utcnow()
            
            # Update claim status
            claim = db.query(Claim).filter(Claim.id == payout.claim_id).first()
            if claim:
                claim.status = ClaimStatus.PAID
            
            db.commit()
            db.refresh(payout)
        
        return payout
    
    @staticmethod
    def get_payout(db: Session, payout_id: int) -> Optional[Payout]:
        """Get payout by ID"""
        return db.query(Payout).filter(Payout.id == payout_id).first()


class EnvironmentalDataService:
    """Service for environmental data operations"""
    
    @staticmethod
    def record_environmental_data(db: Session, zone: str, data: Dict) -> EnvironmentalData:
        """Record environmental reading for zone"""
        
        env_data = EnvironmentalData(
            zone=zone,
            timestamp=datetime.utcnow(),
            temperature=data.get('temperature'),
            rainfall=data.get('rainfall'),
            aqi=data.get('aqi'),
            traffic_index=data.get('traffic_index'),
            delivery_demand=data.get('delivery_demand'),
            active_riders=data.get('active_riders'),
            order_volume=data.get('order_volume')
        )
        
        db.add(env_data)
        db.commit()
        db.refresh(env_data)
        return env_data
    
    @staticmethod
    def get_zone_data(db: Session, zone: str, hours: int = 24) -> List[EnvironmentalData]:
        """Get environmental data for zone in last N hours"""
        since = datetime.utcnow() - timedelta(hours=hours)
        return db.query(EnvironmentalData).filter(
            EnvironmentalData.zone == zone,
            EnvironmentalData.timestamp >= since
        ).all()
