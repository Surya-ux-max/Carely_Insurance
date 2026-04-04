"""
API endpoints for GigShield
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.schemas import (
    WorkerCreate, WorkerResponse, SubscriptionCreate, SubscriptionResponse,
    RiskAssessmentRequest, RiskAssessmentResponse, ClaimCreate, ClaimResponse,
    PayoutCreate, PayoutResponse, EnvironmentalDataCreate, EnvironmentalDataResponse,
    ClaimDetailResponse
)
from app.services.services import (
    WorkerService, SubscriptionService, RiskAssessmentService,
    ClaimService, PayoutService, EnvironmentalDataService
)

# Create routers
router = APIRouter(prefix="/api/v1", tags=["GigShield"])

# ==================== Worker Endpoints ====================

@router.post("/workers", response_model=WorkerResponse)
def create_worker(worker: WorkerCreate, db: Session = Depends(get_db)):
    """Create new worker"""
    try:
        return WorkerService.create_worker(db, worker)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/workers")
def list_workers(db: Session = Depends(get_db)):
    """List all workers"""
    workers = WorkerService.list_workers(db)
    return {"total_workers": len(workers), "workers": workers}


@router.get("/workers/{worker_id}", response_model=WorkerResponse)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    """Get worker details"""
    worker = WorkerService.get_worker(db, worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker


@router.get("/workers/user/{user_id}", response_model=WorkerResponse)
def get_worker_by_user_id(user_id: str, db: Session = Depends(get_db)):
    """Get worker by user_id"""
    worker = WorkerService.get_worker_by_user_id(db, user_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker


# ==================== Subscription Endpoints ====================

@router.post("/subscriptions", response_model=SubscriptionResponse)
def create_subscription(subscription: SubscriptionCreate, db: Session = Depends(get_db)):
    """Create worker subscription"""
    try:
        return SubscriptionService.create_subscription(
            db, subscription.worker_id, subscription.plan_id
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/subscriptions/worker/{worker_id}", response_model=SubscriptionResponse)
def get_active_subscription(worker_id: int, db: Session = Depends(get_db)):
    """Get active subscription for worker"""
    subscription = SubscriptionService.get_active_subscription(db, worker_id)
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription found")
    return subscription


@router.get("/subscriptions/worker/{worker_id}/coverage")
def check_coverage(worker_id: int, db: Session = Depends(get_db)):
    """Check if worker has active insurance coverage"""
    is_covered = SubscriptionService.is_worker_covered(db, worker_id)
    return {"worker_id": worker_id, "has_active_coverage": is_covered}


# ==================== Risk Assessment Endpoints ====================

@router.post("/risk/assess", response_model=RiskAssessmentResponse)
def assess_risk(request: RiskAssessmentRequest, db: Session = Depends(get_db)):
    """
    Assess disruption risk for a zone
    
    Request body:
    {
        "zone": "Bangalore_North",
        "temperature": 42,
        "rainfall": 85,
        "aqi": 250,
        "traffic_index": 0.88,
        "delivery_demand": 0.65
    }
    """
    try:
        data = {
            "temperature": request.temperature,
            "rainfall": request.rainfall,
            "aqi": request.aqi,
            "traffic_index": request.traffic_index,
            "delivery_demand": request.delivery_demand
        }
        
        response = RiskAssessmentService.assess_zone_risk(db, request.zone, data)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==================== Environmental Data Endpoints ====================

@router.post("/environmental-data", response_model=EnvironmentalDataResponse)
def record_environmental_data(
    data: EnvironmentalDataCreate,
    db: Session = Depends(get_db)
):
    """Record environmental data for zone"""
    try:
        data_dict = data.dict()
        zone = data_dict.pop('zone')
        result = EnvironmentalDataService.record_environmental_data(db, zone, data_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/environmental-data/{zone}")
def get_zone_data(zone: str, hours: int = 24, db: Session = Depends(get_db)):
    """Get environmental data for zone"""
    data = EnvironmentalDataService.get_zone_data(db, zone, hours)
    return {
        "zone": zone,
        "hours": hours,
        "data_points": len(data),
        "data": [
            {
                "timestamp": d.timestamp.isoformat(),
                "temperature": d.temperature,
                "rainfall": d.rainfall,
                "aqi": d.aqi,
                "traffic_index": d.traffic_index,
                "delivery_demand": d.delivery_demand
            }
            for d in data
        ]
    }


# ==================== Claims Endpoints ====================

@router.post("/claims", response_model=ClaimResponse)
def create_claim(claim: ClaimCreate, db: Session = Depends(get_db)):
    """Create insurance claim"""
    
    # Check worker has active subscription
    if not SubscriptionService.is_worker_covered(db, claim.worker_id):
        raise HTTPException(
            status_code=403,
            detail="Worker does not have active insurance coverage"
        )
    
    try:
        return ClaimService.create_claim(db, claim)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/claims")
def list_all_claims(db: Session = Depends(get_db)):
    """List all claims"""
    from app.models.db import Claim as ClaimModel
    claims = db.query(ClaimModel).all()
    return {
        "total_claims": len(claims),
        "claims": [
            {
                "id": c.id,
                "worker_id": c.worker_id,
                "status": c.status.value if hasattr(c.status, 'value') else c.status,
                "amount": c.claim_amount,
                "description": c.verification_notes or "",
                "fraud_score": c.fraud_score or 0.0,
                "created_at": c.created_at.isoformat(),
                "date": c.created_at.strftime("%Y-%m-%d")
            }
            for c in claims
        ]
    }


@router.post("/claims/{claim_id}/verify")
def verify_claim(claim_id: int, db: Session = Depends(get_db)):
    """Verify claim for fraud"""
    is_valid, fraud_details, fraud_score = ClaimService.verify_claim(db, claim_id)
    
    claim = ClaimService.get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    return {
        "claim_id": claim_id,
        "valid": is_valid,
        "fraud_score": fraud_score,
        "status": claim.status,
        "fraud_details": fraud_details
    }


@router.get("/claims/{claim_id}", response_model=ClaimDetailResponse)
def get_claim(claim_id: int, db: Session = Depends(get_db)):
    """Get claim details"""
    claim = ClaimService.get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


@router.get("/claims/worker/{worker_id}")
def list_claims(worker_id: int, db: Session = Depends(get_db)):
    """List claims for worker"""
    claims = ClaimService.list_claims(db, worker_id)
    return [
        {
            "id": c.id,
            "worker_id": c.worker_id,
            "subscription_id": c.subscription_id,
            "status": c.status.value if hasattr(c.status, 'value') else c.status,
            "claim_amount": c.claim_amount,
            "estimated_income_loss": c.estimated_income_loss or c.claim_amount,
            "fraud_score": c.fraud_score or 0.0,
            "fraud_checks": c.fraud_checks or {},
            "verified_by": c.verified_by or "",
            "verification_notes": c.verification_notes or "",
            "created_at": c.created_at.isoformat(),
            "updated_at": c.updated_at.isoformat() if c.updated_at else c.created_at.isoformat()
        }
        for c in claims
    ]


@router.post("/claims/{claim_id}/approve")
def approve_claim(claim_id: int, db: Session = Depends(get_db)):
    """Approve claim for payout"""
    claim = ClaimService.approve_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    return {
        "claim_id": claim_id,
        "status": claim.status,
        "amount": claim.claim_amount,
        "message": "Claim approved for payout"
    }


# ==================== Payout Endpoints ====================

@router.post("/payouts", response_model=PayoutResponse)
def initiate_payout(payout: PayoutCreate, db: Session = Depends(get_db)):
    """Initiate payout for approved claim"""
    try:
        return PayoutService.initiate_payout(db, payout.claim_id, payout.recipient_phone)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/payouts/{payout_id}/complete")
def complete_payout(payout_id: int, db: Session = Depends(get_db), razorpay_transfer_id: str = "mock_transfer_id"):
    """Mark payout as completed"""
    try:
        payout = PayoutService.complete_payout(db, payout_id, razorpay_transfer_id)
        return {
            "payout_id": payout_id,
            "status": payout.payment_status,
            "amount": payout.amount,
            "completed_at": payout.completed_at.isoformat() if payout.completed_at else None
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/payouts/{payout_id}", response_model=PayoutResponse)
def get_payout(payout_id: int, db: Session = Depends(get_db)):
    """Get payout details"""
    payout = PayoutService.get_payout(db, payout_id)
    if not payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    return payout


# ==================== Stats Endpoint ====================

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    from app.models.db import Worker as WorkerModel, Subscription as SubModel, Claim as ClaimModel, Payout as PayoutModel, ClaimStatus
    from sqlalchemy import func
    total_workers = db.query(func.count(WorkerModel.id)).scalar() or 0
    active_subs = db.query(func.count(SubModel.id)).filter(
        SubModel.status == "ACTIVE"
    ).scalar() or 0
    total_claims = db.query(func.count(ClaimModel.id)).scalar() or 0
    total_payouts = db.query(func.count(PayoutModel.id)).scalar() or 0
    pending_claims = db.query(func.count(ClaimModel.id)).filter(
        ClaimModel.status == ClaimStatus.PENDING
    ).scalar() or 0
    fraud_detected = db.query(func.count(ClaimModel.id)).filter(
        ClaimModel.status == ClaimStatus.REJECTED
    ).scalar() or 0
    return {
        "total_workers": total_workers,
        "active_subscriptions": active_subs,
        "total_claims": total_claims,
        "total_payouts": total_payouts,
        "pending_claims": pending_claims,
        "fraud_detected": fraud_detected,
        "average_payout_time": 2.5
    }


# ==================== Health/Status Endpoints ====================

@router.get("/health")
def health_check():
    """API health check"""
    return {"status": "healthy", "service": "GigShield AI"}


@router.get("/info")
def get_info():
    """Get service information"""
    return {
        "service": "GigShield AI - Parametric Insurance for Gig Workers",
        "version": "0.1.0",
        "endpoints": {
            "workers": "/api/v1/workers",
            "subscriptions": "/api/v1/subscriptions",
            "risk_assessment": "/api/v1/risk/assess",
            "environmental_data": "/api/v1/environmental-data",
            "claims": "/api/v1/claims",
            "payouts": "/api/v1/payouts"
        }
    }
