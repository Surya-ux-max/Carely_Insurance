import app.services.services as svc_module

print("Module attributes:")
attrs = dir(svc_module)
for attr in attrs:
    if not attr.startswith('_'):
        print(f"  - {attr}")

print("\nLooking for WorkerService...")
if hasattr(svc_module, 'WorkerService'):
    print("  Found WorkerService!")
else:
    print("  WorkerService NOT FOUND")

print("\nNumber of attributes:", len(attrs))
