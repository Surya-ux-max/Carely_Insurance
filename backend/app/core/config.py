"""
Application configuration settings
"""
from pydantic_settings import BaseSettings
from pydantic import ConfigDict, field_validator
from typing import Any


class Settings(BaseSettings):
    """Application configuration"""

    # App
    app_name: str = "Carely"
    debug: bool = False
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

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, v: Any) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("1", "true", "yes", "on")
        return False

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


settings = Settings()
