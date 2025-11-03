"""
Database models for conversation history
"""
from sqlalchemy import Column, String, Text, DateTime, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid


Base = declarative_base()


class Conversation(Base):
    """
    Model for storing conversation history between user and AI
    """
    __tablename__ = "conversations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    user_id = Column(String(255), nullable=True)
    
    # Message content
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    
    # Audio file references
    audio_url_user = Column(String(500), nullable=True)
    audio_url_ai = Column(String(500), nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    metadata = Column(JSON, nullable=True)
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "session_id": str(self.session_id),
            "user_id": self.user_id,
            "user_message": self.user_message,
            "ai_response": self.ai_response,
            "audio_url_user": self.audio_url_user,
            "audio_url_ai": self.audio_url_ai,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "metadata": self.metadata
        }


class Session(Base):
    """
    Model for tracking conversation sessions
    """
    __tablename__ = "sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=True)
    title = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Session metadata
    message_count = Column(Integer, default=0)
    metadata = Column(JSON, nullable=True)
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "title": self.title,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "message_count": self.message_count,
            "metadata": self.metadata
        }

