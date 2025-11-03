"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.database import init_db
from app.routes import audio, chat, history


# Create FastAPI app
app = FastAPI(
    title="Human-AI Learning Platform API",
    description="Backend API for AI-powered language learning with voice interaction",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for audio
audio_dir = Path(settings.audio_storage_path)
audio_dir.mkdir(parents=True, exist_ok=True)
app.mount("/audio", StaticFiles(directory=str(audio_dir)), name="audio")

# Include routers
app.include_router(audio.router)
app.include_router(chat.router)
app.include_router(history.router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("✓ Database initialized")
    print(f"✓ Audio storage: {settings.audio_storage_path}")
    print(f"✓ ChromaDB path: {settings.chroma_db_path}")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Human-AI Learning Platform API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "api": "running",
            "database": "connected",
            "tts": "ready",
            "langchain": "ready"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )

