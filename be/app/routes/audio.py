"""
Audio API endpoints for TTS and audio file serving
"""
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Literal, Optional
from app.services.tts_service import tts_service


router = APIRouter(prefix="/api/audio", tags=["audio"])


class TTSRequest(BaseModel):
    """Request model for text-to-speech synthesis using Google TTS (FREE)"""
    text: str = Field(..., min_length=1, max_length=5000, description="Text to convert to speech")
    voice: Literal["com", "co.uk", "com.au", "ca", "co.in", "ie", "co.za"] = Field(
        default="com",
        description="English accent (com=US, co.uk=UK, com.au=Australia, etc.)"
    )
    speed: float = Field(default=1.0, ge=0.25, le=2.0, description="Speech speed (slow if < 0.9)")
    language: Optional[str] = Field(default="en", description="Language code (en, vi, etc.)")
    output_format: Literal["mp3"] = Field(
        default="mp3",
        description="Output audio format (Google TTS only supports mp3)"
    )


class TTSResponse(BaseModel):
    """Response model for TTS synthesis"""
    success: bool
    audio_url: str
    filename: str
    format: str
    voice: str
    speed: float
    file_size: int
    text_length: int
    message: str = "Audio synthesized successfully"


@router.post("/synthesize", response_model=TTSResponse, status_code=status.HTTP_201_CREATED)
async def synthesize_speech(request: TTSRequest):
    """
    Convert text to speech using Google TTS (FREE)
    
    - **text**: The text to convert to speech
    - **voice**: English accent (com=US, co.uk=UK, com.au=Australia, etc.)
    - **speed**: Speech speed from 0.25 to 2.0 (slow mode if < 0.9)
    - **language**: Language code (en, vi, fr, de, ja, ko, etc.)
    - **output_format**: Audio format (always mp3 for Google TTS)
    """
    try:
        # Use Vietnamese-optimized synthesis if language is Vietnamese
        if request.language == "vi":
            result = await tts_service.synthesize_vietnamese(
                text=request.text,
                voice=request.voice,
                speed=request.speed if request.speed != 1.0 else 0.9
            )
        else:
            result = await tts_service.synthesize(
                text=request.text,
                voice=request.voice,
                speed=request.speed,
                output_format=request.output_format,
                language=request.language
            )
        
        return TTSResponse(
            success=True,
            audio_url=result["audio_url"],
            filename=result["filename"],
            format=result["format"],
            voice=result["voice"],
            speed=result["speed"],
            file_size=result["file_size"],
            text_length=result["text_length"]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to synthesize speech: {str(e)}"
        )


@router.get("/{filename}")
async def serve_audio(filename: str):
    """
    Serve audio file
    
    - **filename**: Name of the audio file to serve
    """
    try:
        audio_path = tts_service.get_audio_path(filename)
        
        if not audio_path:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Audio file not found"
            )
        
        # Determine media type based on file extension
        extension = filename.split('.')[-1].lower()
        media_types = {
            "mp3": "audio/mpeg",
            "opus": "audio/opus",
            "aac": "audio/aac",
            "flac": "audio/flac",
            "wav": "audio/wav"
        }
        media_type = media_types.get(extension, "audio/mpeg")
        
        return FileResponse(
            path=audio_path,
            media_type=media_type,
            filename=filename
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to serve audio file: {str(e)}"
        )


@router.delete("/{filename}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_audio(filename: str):
    """
    Delete an audio file
    
    - **filename**: Name of the audio file to delete
    """
    try:
        success = tts_service.delete_audio(filename)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Audio file not found"
            )
        
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete audio file: {str(e)}"
        )

