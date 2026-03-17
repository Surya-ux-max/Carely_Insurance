#!/usr/bin/env python
import sys
import traceback

print("Python path:", sys.path)

try:
    print("Importing app.ml.models...")
    from app.ml.models import risk_model, fraud_model
    print("✓ ML models imported successfully")
except Exception as e:
    print(f"✗ Error importing ML models: {e}")
    traceback.print_exc()

try:
    print("\nImporting app.services.services...")
    from app.services.services import WorkerService
    print("✓ WorkerService imported successfully")
except Exception as e:
    print(f"✗ Error importing WorkerService: {e}")
    traceback.print_exc()
