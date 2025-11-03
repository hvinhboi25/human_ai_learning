from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API Keys
    groq_api_key: str  # Free Groq API key
    
    # Database
    database_url: str
    
    # ChromaDB
    chroma_db_path: str = "../db/chroma_db"
    
    # Audio Storage
    audio_storage_path: str = "./audio_files"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

