#!/usr/bin/env python
"""
GigShield Backend Entry Point
"""
import uvicorn
import sys
from app.main import app
from app.core.config import settings


def main():
    """Start the backend server"""
    print(f"""
    ╔═══════════════════════════════════════╗
    ║   🛡️  GigShield AI - Backend Server   ║
    ╚═══════════════════════════════════════╝
    
    Service: {settings.app_name}
    Version: {settings.version}
    Debug: {settings.debug}
    """)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )


if __name__ == "__main__":
    main()
