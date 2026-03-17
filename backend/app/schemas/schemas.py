"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class RiskLevelSchema(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class ClaimStatusSchema(str, Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    PAID = "PAID"


# ==================== Worker Schemas ====================

class WorkerBase(BaseModel):
    name: str
    phone: str
    email: str
    zone: str
    platform: str


class WorkerCreate(WorkerBase):
    user_id: str


class WorkerUpdate(BaseModel):
    name: Optional[str] = None
    zone: Optional[str] = None
    active: Optional[bool] = None


class WorkerResponse(WorkerBase):
    id: int
    user_id: str
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Insurance Plan Schemas ====================

class InsurancePlanBase(BaseModel):
    name: str
    duration_days: int
    premium_amount: float
    payout_amount: float


class InsurancePlanCreate(InsurancePlanBase):
    pass


class InsurancePlanResponse(InsurancePlanBase):
    id: int
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Subscription Schemas ====================

class SubscriptionBase(BaseModel):
    worker_id: int
    plan_id: int


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionResponse(BaseModel):
    id: int
    worker_id: int
    plan_id: int
    status: str
    premium_paid: float
    activation_date: datetime
    expiry_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Environmental Data Schemas ====================

class EnvironmentalDataBase(BaseModel):
    zone: str
    temperature: float
    rainfall: float
    aqi: float
    traffic_index: float
    delivery_demand: float
    active_riders: int
    order_volume: int


class EnvironmentalDataCreate(EnvironmentalDataBase):
    pass


class EnvironmentalDataResponse(EnvironmentalDataBase):
    id: int
    timestamp: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Zone Threshold Schemas ====================

class ZoneThresholdBase(BaseModel):
    zone: str
    temperature_threshold: float
    rainfall_threshold: float
    aqi_threshold: float
    traffic_threshold: float
    delivery_drop_threshold: float


class ZoneThresholdCreate(ZoneThresholdBase):
    pass


class ZoneThresholdUpdate(BaseModel):
    temperature_threshold: Optional[float] = None
    rainfall_threshold: Optional[float] = None
    aqi_threshold: Optional[float] = None
    traffic_threshold: Optional[float] = None
    delivery_drop_threshold: Optional[float] = None


class ZoneThresholdResponse(ZoneThresholdBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== Risk Assessment Schemas ====================

class RiskAssessmentRequest(BaseModel):
    zone: str
    temperature: float
    rainfall: float
    aqi: float
    traffic_index: float
    delivery_demand: float


class RiskAssessmentResponse(BaseModel):
    zone: str
    risk_score: float = Field(..., ge=0, le=1)
    risk_level: RiskLevelSchema
    triggered: bool
    triggering_factors: List[str]


# ==================== Claim Schemas ====================

class ClaimBase(BaseModel):
    worker_id: int
    subscription_id: int


class ClaimCreate(ClaimBase):
    disruption_event_id: int
    claim_amount: float


class ClaimResponse(BaseModel):
    id: int
    worker_id: int
    status: ClaimStatusSchema
    claim_amount: float
    fraud_score: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClaimDetailResponse(ClaimResponse):
    estimated_income_loss: float
    verification_notes: Optional[str]
    fraud_checks: dict


# ==================== Payout Schemas ====================

class PayoutBase(BaseModel):
    claim_id: int
    amount: float
    recipient_phone: str


class PayoutCreate(PayoutBase):
    pass


class PayoutResponse(BaseModel):
    id: int
    claim_id: int
    amount: float
    currency: str
    payment_status: str
    razorpay_order_id: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== Disruption Event Schemas ====================

class DisruptionEventResponse(BaseModel):
    id: int
    zone: str
    event_timestamp: datetime
    risk_score: float
    risk_level: RiskLevelSchema
    triggered_by: str
    environmental_data: dict
    created_at: datetime

    class Config:
        from_attributes = True
