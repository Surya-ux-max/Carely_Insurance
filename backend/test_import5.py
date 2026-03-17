import sys
import traceback

print("Attempting to import app.services.services...")
try:
    import app.services.services as svc_module
    print("Import succeeded")
except Exception as e:
    print(f"Import failed with exception: {e}")
    traceback.print_exc()
    sys.exit(1)

print("\nModule name:", svc_module.__name__)
print("Module file:", svc_module.__file__)

print("\nAll module attributes:")
for attr in dir(svc_module):
    print(f"  - {attr}")

print("\nLooking for WorkerService...")
if hasattr(svc_module, 'WorkerService'):
    print("  Found WorkerService!")
    print("  Type:", type(svc_module.WorkerService))
else:
    print("  WorkerService NOT FOUND")

print("\nAttempting direct from import...")
try:
    from app.services.services import WorkerService
    print("Direct import succeeded!")
except Exception as e:
    print(f"Direct import failed: {e}")
    traceback.print_exc()
