"""
Day 11: Backend Foundation
FastAPI + Groq chat endpoint
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

# Load environment variables
load_dotenv()

# FastAPI app
app = FastAPI(
    title="AI Learning Platform - Day 11",
    description="Basic chat with Groq AI",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Database connection
def get_db():
    """Get database connection"""
    return psycopg2.connect(
        os.getenv("DATABASE_URL"),
        cursor_factory=RealDictCursor
    )


# Pydantic models
class ChatMessage(BaseModel):
    text: str


class ChatResponse(BaseModel):
    user_message: str
    ai_response: str
    conversation_id: int
    timestamp: str


# Routes
@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "AI Learning Platform - Day 11",
        "status": "running",
        "endpoints": {
            "chat": "POST /chat",
            "health": "GET /health"
        }
    }


@app.get("/health")
def health():
    """Health check"""
    try:
        conn = get_db()
        conn.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


@app.post("/chat", response_model=ChatResponse)
def chat(message: ChatMessage):
    """
    Chat endpoint
    Receives user message, calls Groq AI, saves to database, returns response
    """
    user_text = message.text.strip()
    
    if not user_text:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        # Call Groq API
        response = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant for language learning. Be friendly, clear, and educational."
                },
                {
                    "role": "user",
                    "content": user_text
                }
            ],
            temperature=0.7,
            max_tokens=1024
        )
        
        ai_text = response.choices[0].message.content
        
        # Save to database
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute(
            """
            INSERT INTO conversations (user_message, ai_response, created_at)
            VALUES (%s, %s, %s)
            RETURNING id, created_at
            """,
            (user_text, ai_text, datetime.now())
        )
        
        result = cur.fetchone()
        conversation_id = result['id']
        timestamp = result['created_at'].isoformat()
        
        conn.commit()
        cur.close()
        conn.close()
        
        return ChatResponse(
            user_message=user_text,
            ai_response=ai_text,
            conversation_id=conversation_id,
            timestamp=timestamp
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    
    print("=" * 50)
    print("🚀 Day 11: Backend Starting...")
    print("=" * 50)
    print(f"📍 Server: http://localhost:{os.getenv('PORT', 8000)}")
    print(f"📖 Docs: http://localhost:{os.getenv('PORT', 8000)}/docs")
    print("=" * 50)
    
    uvicorn.run(
        app,
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )

