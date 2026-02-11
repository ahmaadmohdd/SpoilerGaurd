import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    
    class Config:
        env_file = ".env"

settings = Settings()
