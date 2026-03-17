"""OpenWeatherMap API integration"""
import httpx
import logging
from typing import Optional, Dict
from datetime import datetime

logger = logging.getLogger(__name__)


class WeatherClient:
    """Client for OpenWeatherMap API"""
    
    BASE_URL = "https://api.openweathermap.org/data/2.5"
    
    def __init__(self, api_key: str):
        """Initialize weather client
        
        Args:
            api_key: OpenWeatherMap API key
        """
        self.api_key = api_key
        self.client = httpx.AsyncClient(timeout=10.0)
    
    async def get_current_weather(
        self,
        latitude: float,
        longitude: float,
        units: str = "metric"
    ) -> Optional[Dict]:
        """Get current weather data
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            units: Temperature unit ('metric' for Celsius)
            
        Returns:
            Weather data dict or None if failed
        """
        try:
            url = f"{self.BASE_URL}/weather"
            params = {
                "lat": latitude,
                "lon": longitude,
                "units": units,
                "appid": self.api_key
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            return {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "pressure": data["main"]["pressure"],
                "rainfall": data.get("rain", {}).get("1h", 0),
                "description": data["weather"][0]["main"],
                "wind_speed": data["wind"]["speed"],
                "timestamp": datetime.fromtimestamp(data["dt"])
            }
        except Exception as e:
            logger.error(f"Weather API error: {e}")
            return None
    
    async def get_aqi(
        self,
        latitude: float,
        longitude: float
    ) -> Optional[int]:
        """Get Air Quality Index
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            
        Returns:
            AQI value (0-500) or None if failed
        """
        try:
            url = f"{self.BASE_URL}/air_pollution"
            params = {
                "lat": latitude,
                "lon": longitude,
                "appid": self.api_key
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            # AQI values: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
            aqi_level = data["list"][0]["main"]["aqi"]
            # Convert to 0-500 scale
            aqi_mapping = {1: 50, 2: 100, 3: 150, 4: 200, 5: 300}
            return aqi_mapping.get(aqi_level, 100)
        except Exception as e:
            logger.error(f"AQI API error: {e}")
            return None
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
