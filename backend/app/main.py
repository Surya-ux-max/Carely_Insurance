from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes import router
from app.database.session import init_db, SessionLocal
from app.core.config import settings


def seed_plans():
    """Seed default insurance plans if not present"""
    from app.models.db import InsurancePlan
    db = SessionLocal()
    try:
        if db.query(InsurancePlan).count() == 0:
            plans = [
                InsurancePlan(id=1, name="DAILY",   duration_days=1,  premium_amount=5.0,   payout_amount=200.0,  active=True),
                InsurancePlan(id=2, name="WEEKLY",  duration_days=7,  premium_amount=25.0,  payout_amount=500.0,  active=True),
                InsurancePlan(id=3, name="MONTHLY", duration_days=30, premium_amount=120.0, payout_amount=2000.0, active=True),
            ]
            db.add_all(plans)
            db.commit()
            print("[+] Insurance plans seeded")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[*] Starting Carely...")
    init_db()
    seed_plans()
    print("[+] Database initialized")
    yield
    print("[x] Shutting down Carely...")


# Create FastAPI app
app = FastAPI(
    title="Carely",
    description="AI-Powered Parametric Insurance for Gig Workers",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to GigShield AI - Parametric Insurance for Gig Workers",
        "docs": "/docs",
        "health": "/api/v1/health",
        "info": "/api/v1/info"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
