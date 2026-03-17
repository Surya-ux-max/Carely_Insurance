import sys
print("Step 1: Importing sqlalchemy...")
from sqlalchemy.orm import Session
print("OK")

print("Step 2: Importing datetime...")
from datetime import datetime, timedelta
print("OK")

print("Step 3: Importing pandas...")
import pandas as pd
print("OK")

print("Step 4: Importing typing...")
from typing import Dict, List, Optional, Tuple
print("OK")

print("Step 5: Importing asyncio...")
import asyncio
print("OK")

print("Step 6: Importing logging...")
import logging
print("OK")

print("Step 7: Importing app.models.db...")
from app.models.db import (
    Worker, Subscription, InsurancePlan, Claim, Payout,
    DisruptionEvent, EnvironmentalData, ZoneThreshold,
    ClaimStatus, PaymentStatus, RiskLevel
)
print("OK")

print("Step 8: Importing app.schemas.schemas...")
from app.schemas.schemas import (
    WorkerCreate, SubscriptionCreate, ClaimCreate,
    RiskAssessmentRequest, RiskAssessmentResponse,
    RiskLevelSchema
)
print("OK")

print("Step 9: Importing app.ml.models...")
from app.ml.models import risk_model, fraud_model
print("OK")

print("Step 10: Importing app.core.config...")
from app.core.config import settings
print("OK")

print("Step 11: Building logger...")
logger = logging.getLogger(__name__)
print("OK")

print("\nAll imports successful! Now executing the services module...")
import app.services.services
print("Module imported successfully!")

print("\nTrying to access WorkerService...")
from app.services.services import WorkerService
print("WorkerService accessed!")
