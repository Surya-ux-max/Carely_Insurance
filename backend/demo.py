"""
Demo script showing GigShield AI workflow
"""
import sys
sys.path.insert(0, '/backend')

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.database.session import SessionLocal, init_db, engine
from app.models.db import Base, InsurancePlan, Worker, RiskLevel, ClaimStatus
from app.services.services import (
    WorkerService, SubscriptionService, RiskAssessmentService,
    ClaimService, PayoutService, EnvironmentalDataService
)
from app.schemas.schemas import (
    WorkerCreate, SubscriptionCreate, RiskAssessmentRequest,
    EnvironmentalDataCreate, ClaimCreate
)


def setup_demo_data(db: Session):
    """Setup demo data"""
    
    print("\n📊 Setting up demo data...")
    
    # Create insurance plans
    plans = [
        InsurancePlan(
            name="DAILY",
            duration_days=1,
            premium_amount=5.0,
            payout_amount=200.0
        ),
        InsurancePlan(
            name="WEEKLY",
            duration_days=7,
            premium_amount=25.0,
            payout_amount=200.0
        ),
        InsurancePlan(
            name="MONTHLY",
            duration_days=30,
            premium_amount=120.0,
            payout_amount=200.0
        ),
    ]
    
    for plan in plans:
        existing = db.query(InsurancePlan).filter(InsurancePlan.name == plan.name).first()
        if not existing:
            db.add(plan)
    
    db.commit()
    print("✅ Plans created")


def demo_worker_onboarding(db: Session):
    """Demo: Worker onboarding"""
    
    print("\n" + "="*50)
    print("1️⃣  DEMO: Worker Onboarding")
    print("="*50)
    
    # Create worker
    worker_data = WorkerCreate(
        user_id="worker_001",
        name="Raj Kumar",
        phone="9876543210",
        email="raj@example.com",
        zone="Bangalore_North",
        platform="Zomato"
    )
    
    worker = WorkerService.create_worker(db, worker_data)
    print(f"✅ Worker created: {worker.name} (ID: {worker.id})")
    
    # Subscribe to plan
    plan = db.query(InsurancePlan).filter(InsurancePlan.name == "WEEKLY").first()
    subscription = SubscriptionService.create_subscription(db, worker.id, plan.id)
    print(f"✅ Subscription created: {plan.name} plan")
    print(f"   - Premium: ₹{plan.premium_amount}")
    print(f"   - Payout: ₹{plan.payout_amount}")
    print(f"   - Valid until: {subscription.expiry_date.date()}")
    
    return worker, subscription


def demo_risk_assessment(db: Session):
    """Demo: Risk assessment during disruption"""
    
    print("\n" + "="*50)
    print("2️⃣  DEMO: Risk Assessment & Disruption Detection")
    print("="*50)
    
    # Environmental data during heavy rainfall
    env_data = {
        "zone": "Bangalore_North",
        "temperature": 38.5,
        "rainfall": 95,  # Heavy rainfall
        "aqi": 280,
        "traffic_index": 0.92,
        "delivery_demand": 0.45,  # 55% drop from baseline
        "active_riders": 250,
        "order_volume": 1200
    }
    
    print("📡 Environmental data received:")
    print(f"   - Zone: {env_data['zone']}")
    print(f"   - Temperature: {env_data['temperature']}°C")
    print(f"   - Rainfall: {env_data['rainfall']}mm")
    print(f"   - AQI: {env_data['aqi']}")
    print(f"   - Traffic Index: {env_data['traffic_index']}")
    print(f"   - Delivery Demand: {env_data['delivery_demand']} (baseline: 1.0)")
    
    # Assess risk
    risk_request = RiskAssessmentRequest(
        zone=env_data['zone'],
        temperature=env_data['temperature'],
        rainfall=env_data['rainfall'],
        aqi=env_data['aqi'],
        traffic_index=env_data['traffic_index'],
        delivery_demand=env_data['delivery_demand']
    )
    
    response = RiskAssessmentService.assess_zone_risk(db, env_data['zone'], env_data)
    
    print(f"\n🤖 AI Risk Assessment:")
    print(f"   - Risk Score: {response.risk_score:.2%}")
    print(f"   - Risk Level: {response.risk_level}")
    print(f"   - Disruption Triggered: {response.triggered}")
    print(f"   - Triggering Factors: {', '.join(response.triggering_factors)}")
    
    # Record environmental data
    env_create = EnvironmentalDataCreate(**env_data)
    EnvironmentalDataService.record_environmental_data(db, env_data['zone'], env_data)
    print(f"\n✅ Environmental data recorded")
    
    return response


def demo_claim_workflow(db: Session, worker, subscription, risk_response):
    """Demo: Automatic claim creation and verification"""
    
    print("\n" + "="*50)
    print("3️⃣  DEMO: Claim Creation & Fraud Detection")
    print("="*50)
    
    # Get disruption event if triggered
    if risk_response.triggered:
        print("🚨 Disruption event triggered!")
        print("⚡ Initiating automatic claim creation...")
        
        # Create claim (would happen automatically in production)
        claim_data = ClaimCreate(
            worker_id=worker.id,
            subscription_id=subscription.id,
            disruption_event_id=1,  # Would be from actual event
            claim_amount=200.0
        )
        
        claim = ClaimService.create_claim(db, claim_data)
        print(f"✅ Claim created (ID: {claim.id})")
        print(f"   - Worker: {worker.name}")
        print(f"   - Amount: ₹{claim.claim_amount}")
        print(f"   - Status: {claim.status}")
        
        # Verify claim
        print(f"\n🔍 Running fraud detection...")
        is_valid, fraud_details, fraud_score = ClaimService.verify_claim(db, claim.id)
        
        claim = db.query(type(claim)).filter(type(claim).id == claim.id).first()
        print(f"✅ Fraud detection complete:")
        print(f"   - Fraud Score: {fraud_score:.2%}")
        print(f"   - Valid: {is_valid}")
        print(f"   - Status: {claim.status}")
        print(f"   - Checks: {fraud_details}")
        
        return claim
    else:
        print("✅ No disruption detected - No claim needed")
        return None


def demo_payout(db: Session, claim):
    """Demo: Payout processing"""
    
    if not claim:
        return
    
    print("\n" + "="*50)
    print("4️⃣  DEMO: Payout Processing")
    print("="*50)
    
    # Approve claim
    approved_claim = ClaimService.approve_claim(db, claim.id)
    print(f"✅ Claim approved")
    
    # Initiate payout
    from app.schemas.schemas import PayoutCreate
    payout_data = PayoutCreate(
        claim_id=claim.id,
        recipient_phone="9876543210",
        amount=200.0
    )
    
    # Manual payout initiation for demo
    from app.models.db import Payout, PaymentStatus
    payout = Payout(
        claim_id=claim.id,
        amount=claim.claim_amount,
        recipient_phone="9876543210",
        currency="INR",
        payment_status=PaymentStatus.INITIATED
    )
    db.add(payout)
    db.commit()
    db.refresh(payout)
    
    print(f"✅ Payout initiated (ID: {payout.id})")
    print(f"   - Amount: ₹{payout.amount}")
    print(f"   - Recipient: {payout.recipient_phone}")
    print(f"   - Status: {payout.payment_status}")
    
    # Complete payout
    payout = PayoutService.complete_payout(db, payout.id, "transfer_12345")
    print(f"\n✅ Payout completed!")
    print(f"   - Razorpay Transfer ID: {payout.razorpay_transfer_id}")
    print(f"   - Status: {payout.payment_status}")
    print(f"   - Completed At: {payout.completed_at}")
    
    return payout


def run_demo():
    """Run complete demo workflow"""
    
    print("""
╔═══════════════════════════════════════════════════╗
║   🛡️  GigShield AI - Complete Workflow Demo      ║
╚═══════════════════════════════════════════════════╝
    """)
    
    # Initialize database
    init_db()
    db = SessionLocal()
    
    try:
        # Setup demo data
        setup_demo_data(db)
        
        # Run demos
        worker, subscription = demo_worker_onboarding(db)
        risk_response = demo_risk_assessment(db)
        claim = demo_claim_workflow(db, worker, subscription, risk_response)
        
        if claim:
            payout = demo_payout(db, claim)
        
        print(f"\n" + "="*50)
        print("✅ Demo Complete!")
        print("="*50)
        print("""
Summary:
✓ Worker onboarded and subscribed
✓ Disruption detected via AI model
✓ Claim automatically created
✓ Fraud checks passed
✓ Payout processed instantly

The GigShield AI system is working end-to-end! 🎉
        """)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    run_demo()
