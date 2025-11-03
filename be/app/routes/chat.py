"""
Main chat API endpoint integrating all services:
- Speech-to-Text (from uploaded audio)
- LangChain + OpenRouter (AI response)
- Text-to-Speech (AI response to audio)
- ChromaDB (context storage)
- History (conversation storage)
"""
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import uuid
import os
import aiofiles
from pathlib import Path

from app.database import get_db
from app.services.tts_service import tts_service
from app.services.langchain_service import langchain_service
from app.models.conversation import Conversation, Session as SessionModel


router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatRequest(BaseModel):
    """Request model for text-based chat"""
    message: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    voice: str = "nova"
    language: str = "en"
    use_rag: bool = False


class ChatResponse(BaseModel):
    """Response model for chat"""
    session_id: str
    user_message: str
    ai_response: str
    ai_audio_url: Optional[str]
    conversation_id: str
    metadata: dict


@router.post("/message", response_model=ChatResponse)
async def chat_message(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Send a text message and receive AI response with audio
    
    Flow:
    1. Get AI response from LangChain + OpenRouter
    2. Convert AI response to speech using TTS
    3. Save conversation to database
    4. Return response with audio URL
    """
    try:
        # Get or create session
        if request.session_id:
            try:
                session_uuid = uuid.UUID(request.session_id)
                session = db.query(SessionModel).filter(SessionModel.id == session_uuid).first()
                if not session:
                    raise ValueError("Session not found")
            except ValueError:
                # Create new session if invalid
                session = SessionModel(
                    user_id=request.user_id,
                    title=request.message[:50]
                )
                db.add(session)
                db.commit()
                db.refresh(session)
        else:
            # Create new session
            session = SessionModel(
                user_id=request.user_id,
                title=request.message[:50]
            )
            db.add(session)
            db.commit()
            db.refresh(session)
        
        # Get AI response from LangChain
        ai_result = await langchain_service.get_response(
            user_input=request.message,
            session_id=str(session.id),
            use_rag=request.use_rag
        )
        ai_response_text = ai_result["response"]
        
        # Convert AI response to speech
        tts_result = await tts_service.synthesize(
            text=ai_response_text,
            voice=request.voice,
            speed=0.9 if request.language == "vi" else 1.0,
            output_format="mp3"
        )
        
        # Save conversation to database
        conversation = Conversation(
            session_id=session.id,
            user_id=request.user_id,
            user_message=request.message,
            ai_response=ai_response_text,
            audio_url_user=None,  # No user audio for text input
            audio_url_ai=tts_result["audio_url"],
            metadata={
                "language": request.language,
                "voice": request.voice,
                "model": ai_result["model"],
                "context_used": ai_result["context_used"],
                "audio_format": tts_result["format"]
            }
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        
        return ChatResponse(
            session_id=str(session.id),
            user_message=request.message,
            ai_response=ai_response_text,
            ai_audio_url=tts_result["audio_url"],
            conversation_id=str(conversation.id),
            metadata={
                "voice": request.voice,
                "language": request.language,
                "audio_file_size": tts_result["file_size"],
                "model": ai_result["model"]
            }
        )
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat processing failed: {str(e)}"
        )


@router.post("/voice", response_model=ChatResponse)
async def chat_voice(
    audio_file: UploadFile = File(...),
    session_id: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None),
    voice: str = Form("nova"),
    language: str = Form("en"),
    use_rag: bool = Form(False),
    db: Session = Depends(get_db)
):
    """
    Send voice message and receive AI response with audio
    
    Flow:
    1. Save user's audio file
    2. Transcribe audio to text using STT (placeholder - implement when ready)
    3. Get AI response from LangChain + OpenRouter
    4. Convert AI response to speech using TTS
    5. Save conversation to database
    6. Return response with audio URL
    """
    try:
        # Create directory for user audio if not exists
        user_audio_dir = Path("audio_files/user")
        user_audio_dir.mkdir(parents=True, exist_ok=True)
        
        # Save user's audio file
        user_audio_filename = f"{uuid.uuid4()}.wav"
        user_audio_path = user_audio_dir / user_audio_filename
        
        async with aiofiles.open(user_audio_path, 'wb') as f:
            content = await audio_file.read()
            await f.write(content)
        
        user_audio_url = f"/audio/user/{user_audio_filename}"
        
        # TODO: Implement Speech-to-Text transcription
        # For now, use placeholder text
        user_message = "[Voice message - transcription pending]"
        # In real implementation:
        # user_message = await stt_service.transcribe(user_audio_path, language=language)
        
        # Get or create session
        if session_id:
            try:
                session_uuid = uuid.UUID(session_id)
                session = db.query(SessionModel).filter(SessionModel.id == session_uuid).first()
                if not session:
                    raise ValueError("Session not found")
            except ValueError:
                session = SessionModel(
                    user_id=user_id,
                    title="Voice conversation"
                )
                db.add(session)
                db.commit()
                db.refresh(session)
        else:
            session = SessionModel(
                user_id=user_id,
                title="Voice conversation"
            )
            db.add(session)
            db.commit()
            db.refresh(session)
        
        # Get AI response from LangChain
        ai_result = await langchain_service.get_response(
            user_input=user_message,
            session_id=str(session.id),
            use_rag=use_rag
        )
        ai_response_text = ai_result["response"]
        
        # Convert AI response to speech
        tts_result = await tts_service.synthesize(
            text=ai_response_text,
            voice=voice,
            speed=0.9 if language == "vi" else 1.0,
            output_format="mp3"
        )
        
        # Save conversation to database
        conversation = Conversation(
            session_id=session.id,
            user_id=user_id,
            user_message=user_message,
            ai_response=ai_response_text,
            audio_url_user=user_audio_url,
            audio_url_ai=tts_result["audio_url"],
            metadata={
                "language": language,
                "voice": voice,
                "model": ai_result["model"],
                "context_used": ai_result["context_used"],
                "audio_format": tts_result["format"]
            }
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        
        return ChatResponse(
            session_id=str(session.id),
            user_message=user_message,
            ai_response=ai_response_text,
            ai_audio_url=tts_result["audio_url"],
            conversation_id=str(conversation.id),
            metadata={
                "voice": voice,
                "language": language,
                "user_audio_url": user_audio_url,
                "audio_file_size": tts_result["file_size"],
                "model": ai_result["model"]
            }
        )
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Voice chat processing failed: {str(e)}"
        )

