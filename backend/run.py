#!/usr/bin/env python
"""
GigShield Backend Entry Point
"""
import uvicorn
import sys
from app.core.config import settings


def main():
    """Start the backend server"""
    print(f"""
    ======================================
    GigShield AI - Backend Server
    ======================================
    
    Service: {settings.app_name}
    Version: {settings.version}
    Debug: {settings.debug}
    """)
    
    if settings.debug:
        # Use app module string for reload to work
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    else:
        # Production mode
        from app.main import app
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=False,
            log_level="info"
        )


if __name__ == "__main__":
    main()
