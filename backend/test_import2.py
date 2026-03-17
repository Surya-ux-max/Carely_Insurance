#!/usr/bin/env python
import sys
import traceback

try:
    print("Loading the file content...")
    with open('app/services/services.py', 'r') as f:
        content = f.read()
    
    # Try to compile it
    print("Compiling the file...")
    code = compile(content, 'app/services/services.py', 'exec')
    print("[OK] File compiled successfully")
    
    # Try to import step by step
    print("\nTrying to import modules used in services.py...")
    from sqlalchemy.orm import Session
    print("[OK] sqlalchemy.orm imported")
    
    from datetime import datetime, timedelta
    print("[OK] datetime imported")
    
    import pandas as pd
    print("[OK] pandas imported")
    
    from typing import Dict, List, Optional, Tuple
    print("[OK] typing imported")
    
    import asyncio
    print("[OK] asyncio imported")
    
    import logging
    print("[OK] logging imported")
    
    print("\nImporting app.models.db...")
    from app.models.db import (
        Worker, Subscription, InsurancePlan, Claim, Payout,
        DisruptionEvent, EnvironmentalData, ZoneThreshold,
        ClaimStatus, PaymentStatus, RiskLevel
    )
    print("[OK] app.models.db imported")
    
    print("\nImporting app.schemas.schemas...")
    from app.schemas.schemas import (
        WorkerCreate, SubscriptionCreate, ClaimCreate,
        RiskAssessmentRequest, RiskAssessmentResponse,
        RiskLevelSchema
    )
    print("[OK] app.schemas.schemas imported")
    
    print("\nImporting app.ml.models...")
    from app.ml.models import risk_model, fraud_model
    print("[OK] app.ml.models imported")
    
    print("\nImporting app.core.config...")
    from app.core.config import settings
    print("[OK] app.core.config imported")
    
    print("\nImporting app integrations...")
    from app.integrations.weather import WeatherClient
    print("[OK] WeatherClient imported")
    
    from app.integrations.payment import RazorpayClient
    print("[OK] RazorpayClient imported")
    
    from app.integrations.delivery import DeliveryDataClient
    print("[OK] DeliveryDataClient imported")
    
    print("\n[OK] All imports successful! Now trying to import WorkerService...")
    from app.services.services import WorkerService
    print("[OK] WorkerService imported successfully")
    
except Exception as e:
    print(f"\n[ERROR] {e}")
    traceback.print_exc()
