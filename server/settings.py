from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    weather_api_key: str = Field(..., alias="WEATHER_API_KEY")

    model_config = {
        "env_file": ".env"
    }

settings = Settings()