"""
SQLAlchemy ORM models for GigShield
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base
import enum


class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class ClaimStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    PAID = "PAID"


class PaymentStatus(str, enum.Enum):
    INITIATED = "INITIATED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class Worker(Base):
    """Gig worker model"""
    __tablename__ = "workers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), unique=True, index=True)
    phone = Column(String(20), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    name = Column(String(100))
    zone = Column(String(50), index=True)  # e.g., "Bangalore_North"
    platform = Column(String(50))  # e.g., "Zomato", "Swiggy", "Uber"
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subscriptions = relationship("Subscription", back_populates="worker")
    claims = relationship("Claim", back_populates="worker")
    
    def __repr__(self):
        return f"<Worker {self.name} ({self.user_id})>"


class InsurancePlan(Base):
    """Insurance plan offerings"""
    __tablename__ = "insurance_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True)  # e.g., "DAILY", "WEEKLY", "MONTHLY"
    duration_days = Column(Integer)
    premium_amount = Column(Float)
    payout_amount = Column(Float)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    subscriptions = relationship("Subscription", back_populates="plan")
    
    def __repr__(self):
        return f"<InsurancePlan {self.name}>"


class Subscription(Base):
    """Worker subscription to insurance plan"""
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("workers.id"), index=True)
    plan_id = Column(Integer, ForeignKey("insurance_plans.id"))
    status = Column(String(20), default="ACTIVE")  # ACTIVE, PAUSED, CANCELLED
    premium_paid = Column(Float, default=0.0)
    activation_date = Column(DateTime)
    expiry_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    worker = relationship("Worker", back_populates="subscriptions")
    plan = relationship("InsurancePlan", back_populates="subscriptions")
    
    def __repr__(self):
        return f"<Subscription worker_id={self.worker_id}>"


class EnvironmentalData(Base):
    """Real-time environmental and operational data"""
    __tablename__ = "environmental_data"
    
    id = Column(Integer, primary_key=True, index=True)
    zone = Column(String(50), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Environmental factors
    temperature = Column(Float)  # Celsius
    rainfall = Column(Float)  # mm
    aqi = Column(Float)  # Air Quality Index
    traffic_index = Column(Float)  # 0-1
    
    # Operational factors
    delivery_demand = Column(Float)  # relative to baseline
    active_riders = Column(Integer)
    order_volume = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<EnvironmentalData zone={self.zone} time={self.timestamp}>"


class ZoneThreshold(Base):
    """Zone-adaptive disruption thresholds"""
    __tablename__ = "zone_thresholds"
    
    id = Column(Integer, primary_key=True, index=True)
    zone = Column(String(50), unique=True, index=True)
    
    # Environmental thresholds
    temperature_threshold = Column(Float)  # Celsius
    rainfall_threshold = Column(Float)  # mm
    aqi_threshold = Column(Float)
    traffic_threshold = Column(Float)  # 0-1
    
    # Operational thresholds
    delivery_drop_threshold = Column(Float)  # percentage drop
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<ZoneThreshold {self.zone}>"


class DisruptionEvent(Base):
    """Detected disruption events"""
    __tablename__ = "disruption_events"
    
    id = Column(Integer, primary_key=True, index=True)
    zone = Column(String(50), index=True)
    event_timestamp = Column(DateTime, index=True)
    
    # Risk assessment
    risk_score = Column(Float)  # 0-1
    risk_level = Column(Enum(RiskLevel))
    
    # Triggering factors
    environmental_trigger = Column(Boolean)
    activity_verification = Column(Boolean)
    
    # Details
    triggered_by = Column(String(100))  # e.g., "RAINFALL", "TEMPERATURE", "TRAFFIC"
    environmental_data = Column(JSON)  # Store the actual values
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<DisruptionEvent zone={self.zone} risk={self.risk_level}>"


class Claim(Base):
    """Insurance claims"""
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("workers.id"), index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"))
    disruption_event_id = Column(Integer, ForeignKey("disruption_events.id"))
    
    status = Column(Enum(ClaimStatus), default=ClaimStatus.PENDING, index=True)
    
    # Claim details
    claim_amount = Column(Float)
    estimated_income_loss = Column(Float)
    
    # Fraud detection
    fraud_score = Column(Float, default=0.0)
    fraud_checks = Column(JSON)  # Store fraud detection results
    
    # Verification
    verified_by = Column(String(100))  # AI system or manual reviewer
    verification_notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    worker = relationship("Worker", back_populates="claims")
    payouts = relationship("Payout", back_populates="claim")
    
    def __repr__(self):
        return f"<Claim worker_id={self.worker_id} status={self.status}>"


class Payout(Base):
    """Payment transactions"""
    __tablename__ = "payouts"
    
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), index=True)
    
    # Payment details
    amount = Column(Float)
    currency = Column(String(3), default="INR")
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.INITIATED)
    
    # Razorpay integration
    razorpay_transfer_id = Column(String(100))
    razorpay_order_id = Column(String(100))
    
    # Recipient details
    recipient_phone = Column(String(20))
    recipient_account = Column(String(50))
    
    notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Relationships
    claim = relationship("Claim", back_populates="payouts")
    
    def __repr__(self):
        return f"<Payout claim_id={self.claim_id} status={self.payment_status}>"
