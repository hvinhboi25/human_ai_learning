# 🚀 Setup Guide - Human-AI Learning Platform (Day 11)

## Yêu cầu hệ thống

### Phần mềm cần cài đặt
- **Python 3.10+** (Backend)
- **Node.js 16+** và npm (Frontend)
- **PostgreSQL 12+** (Database)
- **Git** (Version control)

### API Keys cần có
- **OpenAI API Key** (cho TTS)
- **OpenRouter API Key** (cho LLM)

---

## 📋 Hướng dẫn Setup từng bước

### Bước 1: Clone hoặc kiểm tra project
```bash
cd C:\Users\pc\Desktop\Project\human_ai_learning
```

### Bước 2: Setup PostgreSQL Database

#### Option A: PostgreSQL local
1. Cài đặt PostgreSQL từ https://www.postgresql.org/download/
2. Tạo database:
```sql
CREATE DATABASE human_ai_learning;
CREATE USER ai_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE human_ai_learning TO ai_user;
```

#### Option B: PostgreSQL Docker
```bash
docker run --name postgres-ai -e POSTGRES_PASSWORD=mysecret -p 5432:5432 -d postgres
docker exec -it postgres-ai psql -U postgres -c "CREATE DATABASE human_ai_learning;"
```

### Bước 3: Setup Backend

#### Windows (Sử dụng batch script)
```bash
cd be
start_backend.bat
```

#### Manual Setup (All OS)
```bash
cd be

# Tạo virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env file với API keys của bạn

# Run migrations
python run_migrations.py

# Start server
python main.py
```

#### Backend .env Configuration
```env
OPENAI_API_KEY=sk-...your_openai_key
OPENROUTER_API_KEY=sk-or-...your_openrouter_key
DATABASE_URL=postgresql://ai_user:your_password@localhost:5432/human_ai_learning
CHROMA_DB_PATH=../db/chroma_db
AUDIO_STORAGE_PATH=./audio_files
HOST=0.0.0.0
PORT=8000
```

### Bước 4: Setup Frontend

#### Windows (Sử dụng batch script)
```bash
cd fe
start_frontend.bat
```

#### Manual Setup (All OS)
```bash
cd fe

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit nếu backend URL khác

# Start development server
npm start
```

#### Frontend .env Configuration
```env
REACT_APP_API_URL=http://localhost:8000
```

---

## ✅ Kiểm tra Setup thành công

### 1. Backend Health Check
Mở browser: http://localhost:8000/health

Kết quả mong đợi:
```json
{
  "status": "healthy",
  "services": {
    "api": "running",
    "database": "connected",
    "tts": "ready",
    "langchain": "ready"
  }
}
```

### 2. Backend API Docs
Mở browser: http://localhost:8000/docs

Bạn sẽ thấy Swagger UI với tất cả API endpoints

### 3. Frontend App
Mở browser: http://localhost:3000

Bạn sẽ thấy:
- Avatar 3D ở giữa màn hình
- Input box ở dưới
- History button ở góc trái trên

---

## 🎯 Test các tính năng

### Test 1: Gửi tin nhắn text
1. Type "Hello, how are you?" vào input box
2. Click "Send"
3. Đợi AI response
4. Audio sẽ tự động play
5. Avatar sẽ animate khi nói

### Test 2: Chat History
1. Click nút 📜 ở góc trái
2. Xem danh sách conversations
3. Click vào 1 conversation để xem chi tiết
4. Thử delete 1 conversation

### Test 3: Audio Player
1. Sau khi AI response
2. Thử điều chỉnh volume
3. Thử thay đổi playback speed
4. Pause/Play audio

### Test 4: Settings
1. Thay đổi voice (chọn voice khác)
2. Thay đổi language (EN/VI)
3. Enable "Use Context (RAG)"
4. Gửi message mới và test

### Test 5: New Chat
1. Click "New Chat" button
2. Session mới được tạo
3. Conversation view clear
4. Bắt đầu chat mới

---

## 🐛 Troubleshooting

### Lỗi: "Database connection failed"
**Giải pháp:**
- Kiểm tra PostgreSQL đang chạy
- Verify DATABASE_URL trong .env
- Test connection: `psql -U ai_user -d human_ai_learning`

### Lỗi: "OpenAI API error"
**Giải pháp:**
- Kiểm tra OPENAI_API_KEY hợp lệ
- Verify có credit trong account
- Check network/firewall

### Lỗi: "Module not found"
**Backend:**
```bash
pip install -r requirements.txt --force-reinstall
```

**Frontend:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "CORS error"
**Giải pháp:**
- Kiểm tra backend đang chạy
- Verify REACT_APP_API_URL trong frontend .env
- Clear browser cache

### Lỗi: "Audio không play"
**Giải pháp:**
- Check browser console cho errors
- Verify audio file tồn tại trong be/audio_files
- Try different browser (Chrome recommended)

### Avatar không animate
**Giải pháp:**
- Check browser supports WebGL
- Open console và xem errors
- Try refreshing page

---

## 📂 Cấu trúc thư mục

```
human_ai_learning/
├── be/                     # Backend
│   ├── app/               # Application code
│   ├── audio_files/       # Generated audio files
│   ├── venv/              # Virtual environment
│   ├── .env               # Environment config
│   ├── main.py            # Entry point
│   └── requirements.txt   # Dependencies
│
├── fe/                     # Frontend
│   ├── src/               # Source code
│   ├── public/            # Static files
│   ├── node_modules/      # Dependencies
│   ├── .env               # Environment config
│   └── package.json       # Dependencies
│
└── db/                     # Database
    ├── chroma_db/         # ChromaDB storage
    └── migrations/        # SQL migrations
```

---

## 🔒 Security Best Practices

### Development
- ✅ .env files trong .gitignore
- ✅ Không commit API keys
- ✅ Use environment variables

### Production (Future)
- 🔒 Enable HTTPS
- 🔒 Setup proper CORS origins
- 🔒 Add rate limiting
- 🔒 Implement authentication
- 🔒 Use secrets management
- 🔒 Setup monitoring/logging

---

## 📊 Performance Tips

### Backend
- Use connection pooling cho PostgreSQL
- Cache frequent queries
- Compress audio files
- Implement CDN cho audio files

### Frontend
- Lazy load components
- Optimize 3D model
- Compress images/assets
- Use production build

---

## 🎓 Learning Resources

### FastAPI
- Docs: https://fastapi.tiangolo.com/
- Tutorial: https://fastapi.tiangolo.com/tutorial/

### React
- Docs: https://react.dev/
- Three.js: https://threejs.org/docs/

### LangChain
- Docs: https://python.langchain.com/
- Examples: https://github.com/langchain-ai/langchain

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs trong terminal
2. Check browser console
3. Verify .env configuration
4. Check API keys còn credit
5. Review error messages carefully

---

## ✨ Next Steps

Sau khi setup thành công:
1. ✅ Test tất cả features
2. ✅ Customize UI/UX
3. ✅ Add more voices
4. ✅ Implement STT
5. ✅ Deploy to production

**Chúc bạn setup thành công! 🎉**

