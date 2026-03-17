"""
Application configuration settings
"""
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Application configuration"""
    
    # App
    app_name: str = "GigShield AI"
    debug: bool = True
    version: str = "0.1.0"
    
    # Database
    database_url: str = "sqlite:///./gigshield.db"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # API Keys
    openweather_api_key: str = ""
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    
    # ML Model
    disruption_threshold: float = 0.65
    fraud_detection_threshold: float = 0.75
    
    # Payment
    default_payout_amount: float = 200.0
    
    # Data Sources
    weather_check_interval_minutes: int = 60
    delivery_data_check_interval_minutes: int = 30
    
    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"
    )


settings = Settings()
