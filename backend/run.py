#!/usr/bin/env python
"""
GigShield Backend Entry Point
"""
import uvicorn
from app.core.config import settings


def main():
    print(f"""
    ======================================
    Carely - An Insurance that truly cares
    ======================================
    Service: {settings.app_name}
    Version: {settings.version}
    Debug:   {settings.debug}
    Docs:    http://localhost:8000/docs
    """)
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )


if __name__ == "__main__":
    main()
