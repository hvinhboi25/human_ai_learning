# Human-AI Learning Platform - Day 11 Implementation

A comprehensive AI-powered language learning platform with voice interaction, 3D avatar, and conversation history.

## 🎯 Features Implemented (Day 11)

### Backend Features
1. **Text-to-Speech Service (100% FREE)**
   - Google TTS integration
   - Multiple English accents (US, UK, Australian, etc.)
   - Support 100+ languages including Vietnamese
   - Adjustable speech speed
   - MP3 format

2. **Chat Pipeline (100% FREE)**
   - Text message processing
   - Voice message handling
   - LangChain + **Groq** integration (Llama 3 70B)
   - ChromaDB for context storage (RAG)
   - Auto TTS conversion for AI responses

3. **Conversation History**
   - PostgreSQL database with sessions and conversations
   - CRUD operations for sessions
   - Message storage with audio URLs
   - Metadata tracking

### Frontend Features
1. **Audio Player Component**
   - Play/pause controls
   - Volume control
   - Playback speed adjustment
   - Progress bar
   - Real-time audio analysis for lip sync

2. **3D Avatar with Lip Sync**
   - Three.js/React Three Fiber integration
   - Real-time mouth animation based on audio
   - Idle animations
   - Speaking indicator

3. **Chat History UI**
   - Sidebar with session list
   - Session preview and metadata
   - Delete functionality
   - Date formatting

4. **Conversation View**
   - Chat bubble interface
   - User vs AI message styling
   - Audio playback for messages
   - Timestamp display
   - Auto-scroll to latest message

5. **Main Page Integration**
   - All components integrated
   - Text and voice input
   - Settings (voice, language, RAG)
   - Session management

## 🏗️ Project Structure

```
human_ai_learning/
├── be/                          # Backend
│   ├── app/
│   │   ├── config.py           # Configuration
│   │   ├── database.py         # Database connection
│   │   ├── models/
│   │   │   └── conversation.py # Database models
│   │   ├── routes/
│   │   │   ├── audio.py        # TTS endpoints
│   │   │   ├── chat.py         # Chat endpoints
│   │   │   └── history.py      # History endpoints
│   │   └── services/
│   │       ├── tts_service.py  # TTS service
│   │       └── langchain_service.py # AI service
│   ├── main.py                 # FastAPI app
│   ├── requirements.txt        # Python dependencies
│   └── run_migrations.py       # DB migration script
│
├── fe/                          # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioPlayer.jsx # Audio player
│   │   │   ├── Avatar3D.jsx    # 3D avatar
│   │   │   ├── ChatHistory.jsx # History sidebar
│   │   │   └── ConversationView.jsx # Chat view
│   │   ├── pages/
│   │   │   └── MainPage.jsx    # Main page
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── public/
│
└── db/                          # Database
    └── migrations/
        └── 001_conversations.sql # Schema migration
```

## 🚀 Setup Instructions

### Backend Setup

1. **Install dependencies:**
```bash
cd be
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your API keys and database URL
```

3. **Setup database:**
```bash
# Run PostgreSQL migration
python run_migrations.py
```

4. **Start backend server:**
```bash
python main.py
# Server runs on http://localhost:8000
```

### Frontend Setup

1. **Install dependencies:**
```bash
cd fe
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit if backend URL is different
```

3. **Start development server:**
```bash
npm start
# App runs on http://localhost:3000
```

## 🔑 Environment Variables

### Backend (.env)
```
# 100% FREE - No credit card required!
GROQ_API_KEY=gsk_your_groq_api_key_here
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
CHROMA_DB_PATH=../db/chroma_db
AUDIO_STORAGE_PATH=./audio_files
```

**Get FREE Groq API Key:** https://console.groq.com/keys (takes 1 minute!)

See `GROQ_SETUP_GUIDE.md` for detailed instructions.

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## 📚 API Endpoints

### Chat
- `POST /api/chat/message` - Send text message
- `POST /api/chat/voice` - Send voice message

### Audio
- `POST /api/audio/synthesize` - Text-to-speech
- `GET /api/audio/{filename}` - Serve audio file
- `DELETE /api/audio/{filename}` - Delete audio file

### History
- `POST /api/history/sessions` - Create session
- `GET /api/history/sessions` - List sessions
- `GET /api/history/sessions/{id}` - Get session details
- `DELETE /api/history/sessions/{id}` - Delete session
- `POST /api/history/conversations` - Save conversation
- `GET /api/history/conversations/{id}` - Get conversation

## 🎨 Technologies Used

### Backend
- Python 3.10
- FastAPI
- LangChain
- **Groq API** (FREE - Llama 3)
- **Google TTS** (FREE)
- ChromaDB
- PostgreSQL
- SQLAlchemy

### Frontend
- React 18
- Three.js / React Three Fiber
- Axios
- Web Audio API

## 🐛 Known Issues & Future Improvements

### Current Limitations
1. Speech-to-Text not yet implemented (placeholder in voice endpoint)
2. Simple 3D avatar (needs professional model)
3. Basic lip sync (can be improved with more sophisticated animation)

### Future Enhancements
1. Add real STT service (OpenAI Whisper)
2. Load professional 3D avatar models (GLTF/FBX)
3. Improve lip sync with phoneme-based animation
4. Add real-time voice conversation
5. Implement user authentication
6. Add language learning exercises
7. Progress tracking and analytics

## 📖 Usage

1. **Start a conversation:**
   - Type a message and press Send
   - Or click Voice to record audio

2. **View history:**
   - Click the history button (📜) on the left
   - Select a previous conversation
   - Delete old conversations

3. **Customize settings:**
   - Choose AI voice (6 options)
   - Select language (English/Vietnamese)
   - Enable RAG for context-aware responses

4. **Interact with avatar:**
   - Watch the avatar animate while AI speaks
   - Replay messages by clicking play buttons
   - Adjust audio speed and volume

## 🔒 Security Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Configure CORS properly in production
- Implement rate limiting for API
- Add authentication/authorization

## 📝 License

Educational project - All rights reserved

## 👥 Contributors

Developed as part of Human-AI Learning Platform project (Day 11 implementation)

---

**Note:** This is a development setup. For production deployment, additional configuration for security, performance, and scalability is required.

