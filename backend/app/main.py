"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes import router
from app.database.session import init_db
from app.core.config import settings

# Lifespan context for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("🚀 Starting GigShield AI...")
    init_db()  # Initialize database tables
    print("✅ Database initialized")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down GigShield AI...")


# Create FastAPI app
app = FastAPI(
    title="GigShield AI",
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
