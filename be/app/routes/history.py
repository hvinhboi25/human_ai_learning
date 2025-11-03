"""
API endpoints for conversation history management
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

from app.database import get_db
from app.models.conversation import Conversation, Session as SessionModel


router = APIRouter(prefix="/api/history", tags=["history"])


# Pydantic models for request/response
class ConversationCreate(BaseModel):
    """Model for creating a new conversation"""
    session_id: str
    user_id: Optional[str] = None
    user_message: str
    ai_response: str
    audio_url_user: Optional[str] = None
    audio_url_ai: Optional[str] = None
    metadata: Optional[dict] = None


class ConversationResponse(BaseModel):
    """Model for conversation response"""
    id: str
    session_id: str
    user_id: Optional[str]
    user_message: str
    ai_response: str
    audio_url_user: Optional[str]
    audio_url_ai: Optional[str]
    created_at: str
    metadata: Optional[dict]


class SessionCreate(BaseModel):
    """Model for creating a new session"""
    user_id: Optional[str] = None
    title: Optional[str] = None
    metadata: Optional[dict] = None


class SessionResponse(BaseModel):
    """Model for session response"""
    id: str
    user_id: Optional[str]
    title: Optional[str]
    created_at: str
    updated_at: str
    message_count: int
    metadata: Optional[dict]
    preview_message: Optional[str] = None


class SessionWithConversations(SessionResponse):
    """Model for session with full conversation history"""
    conversations: List[ConversationResponse]


# Session endpoints
@router.post("/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: SessionCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new conversation session
    """
    try:
        new_session = SessionModel(
            user_id=session_data.user_id,
            title=session_data.title,
            metadata=session_data.metadata
        )
        
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        
        return new_session.to_dict()
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create session: {str(e)}"
        )


@router.get("/sessions", response_model=List[SessionResponse])
async def get_sessions(
    user_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Get list of conversation sessions
    
    - **user_id**: Filter by user ID (optional)
    - **limit**: Maximum number of sessions to return
    - **offset**: Number of sessions to skip
    """
    try:
        query = db.query(SessionModel)
        
        if user_id:
            query = query.filter(SessionModel.user_id == user_id)
        
        sessions = query.order_by(desc(SessionModel.updated_at)).limit(limit).offset(offset).all()
        
        # Add preview message for each session
        result = []
        for session in sessions:
            session_dict = session.to_dict()
            
            # Get first conversation as preview
            first_conv = db.query(Conversation).filter(
                Conversation.session_id == session.id
            ).order_by(Conversation.created_at).first()
            
            if first_conv:
                session_dict["preview_message"] = first_conv.user_message[:100]
            
            result.append(session_dict)
        
        return result
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch sessions: {str(e)}"
        )


@router.get("/sessions/{session_id}", response_model=SessionWithConversations)
async def get_session(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific session with all conversations
    
    - **session_id**: UUID of the session
    """
    try:
        # Validate UUID
        try:
            uuid.UUID(session_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid session ID format"
            )
        
        # Get session
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        
        # Get all conversations for this session
        conversations = db.query(Conversation).filter(
            Conversation.session_id == session_id
        ).order_by(Conversation.created_at).all()
        
        session_dict = session.to_dict()
        session_dict["conversations"] = [conv.to_dict() for conv in conversations]
        
        return session_dict
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch session: {str(e)}"
        )


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete a session and all its conversations
    
    - **session_id**: UUID of the session to delete
    """
    try:
        # Validate UUID
        try:
            uuid.UUID(session_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid session ID format"
            )
        
        # Get session
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        
        # Delete session (conversations will be deleted via CASCADE)
        db.delete(session)
        db.commit()
        
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete session: {str(e)}"
        )


# Conversation endpoints
@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def save_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db)
):
    """
    Save a new conversation message
    
    - **session_id**: UUID of the session
    - **user_message**: User's message
    - **ai_response**: AI's response
    - **audio_url_user**: URL to user's audio file (optional)
    - **audio_url_ai**: URL to AI's audio file (optional)
    """
    try:
        # Validate session exists
        try:
            session_uuid = uuid.UUID(conversation.session_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid session ID format"
            )
        
        session = db.query(SessionModel).filter(SessionModel.id == session_uuid).first()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        
        # Create conversation
        new_conversation = Conversation(
            session_id=session_uuid,
            user_id=conversation.user_id,
            user_message=conversation.user_message,
            ai_response=conversation.ai_response,
            audio_url_user=conversation.audio_url_user,
            audio_url_ai=conversation.audio_url_ai,
            metadata=conversation.metadata
        )
        
        db.add(new_conversation)
        db.commit()
        db.refresh(new_conversation)
        
        return new_conversation.to_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save conversation: {str(e)}"
        )


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific conversation by ID
    
    - **conversation_id**: UUID of the conversation
    """
    try:
        # Validate UUID
        try:
            uuid.UUID(conversation_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid conversation ID format"
            )
        
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        return conversation.to_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch conversation: {str(e)}"
        )


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete a specific conversation
    
    - **conversation_id**: UUID of the conversation to delete
    """
    try:
        # Validate UUID
        try:
            uuid.UUID(conversation_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid conversation ID format"
            )
        
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        db.delete(conversation)
        db.commit()
        
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete conversation: {str(e)}"
        )

