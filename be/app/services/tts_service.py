"""
Text-to-Speech Service using Google TTS (FREE)
Supports multiple languages including Vietnamese
"""
import os
import uuid
from pathlib import Path
from typing import Literal, Optional
import asyncio
from gtts import gTTS
from app.config import settings


class TTSService:
    """Text-to-Speech service for converting text to audio using Google TTS (FREE)"""
    
    # Google TTS voices/accents available
    VOICES = Literal["com", "co.uk", "com.au", "ca", "co.in", "ie", "co.za"]  # English accents
    
    def __init__(self):
        self.audio_dir = Path(settings.audio_storage_path)
        self.audio_dir.mkdir(parents=True, exist_ok=True)
    
    async def synthesize(
        self,
        text: str,
        voice: str = "com",
        speed: float = 1.0,
        output_format: str = "mp3",
        language: str = "en"
    ) -> dict:
        """
        Convert text to speech using Google TTS (FREE)
        
        Args:
            text: Text to convert to speech
            voice: TLD for accent (com, co.uk, com.au, ca, etc.)
            speed: Speech speed (0.25 to 2.0) - slow=True if speed < 0.9
            output_format: Audio format (always mp3 for gTTS)
            language: Language code (en, vi, etc.)
            
        Returns:
            dict with audio_path, audio_url, and metadata
        """
        try:
            # Generate unique filename
            filename = f"{uuid.uuid4()}.mp3"
            filepath = self.audio_dir / filename
            
            # Determine if slow speech
            slow = speed < 0.9
            
            # Run gTTS in thread pool to avoid blocking
            def _generate_tts():
                tts = gTTS(
                    text=text,
                    lang=language,
                    slow=slow,
                    tld=voice if language == 'en' else 'com'
                )
                tts.save(str(filepath))
            
            # Run in executor to make it async
            await asyncio.get_event_loop().run_in_executor(None, _generate_tts)
            
            # Get file size
            file_size = os.path.getsize(filepath)
            
            return {
                "audio_path": str(filepath),
                "audio_url": f"/audio/{filename}",
                "filename": filename,
                "format": "mp3",
                "voice": voice,
                "speed": speed,
                "file_size": file_size,
                "text_length": len(text)
            }
            
        except Exception as e:
            raise Exception(f"TTS synthesis failed: {str(e)}")
    
    async def synthesize_vietnamese(
        self,
        text: str,
        voice: str = "com",
        speed: float = 0.9  # Slightly slower for Vietnamese
    ) -> dict:
        """
        Optimized synthesis for Vietnamese language using Google TTS
        """
        return await self.synthesize(
            text=text,
            voice=voice,
            speed=speed,
            output_format="mp3",
            language="vi"
        )
    
    def delete_audio(self, filename: str) -> bool:
        """
        Delete an audio file
        
        Args:
            filename: Name of the audio file to delete
            
        Returns:
            True if deleted successfully, False otherwise
        """
        try:
            filepath = self.audio_dir / filename
            if filepath.exists():
                filepath.unlink()
                return True
            return False
        except Exception:
            return False
    
    def get_audio_path(self, filename: str) -> Optional[Path]:
        """
        Get full path of an audio file
        
        Args:
            filename: Name of the audio file
            
        Returns:
            Path object if file exists, None otherwise
        """
        filepath = self.audio_dir / filename
        return filepath if filepath.exists() else None


# Singleton instance
tts_service = TTSService()

