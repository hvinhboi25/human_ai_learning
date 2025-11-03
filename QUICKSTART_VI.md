# ⚡ Hướng dẫn Khởi động Nhanh - Ngày 11

## 🎯 Mục đích
Document này hướng dẫn nhanh nhất để chạy được project trong 5 phút.

---

## ✅ Checklist trước khi bắt đầu

- [ ] Đã cài Python 3.10+
- [ ] Đã cài Node.js 16+
- [ ] Đã cài PostgreSQL
- [ ] Có Groq API key (FREE - lấy từ https://console.groq.com/keys)

---

## 🚀 3 Bước Đơn Giản

### Bước 1️⃣: Setup Database (1 phút)
```bash
# Tạo database trong PostgreSQL
psql -U postgres
CREATE DATABASE human_ai_learning;
\q
```

### Bước 2️⃣: Chạy Backend (2 phút)
```bash
cd be

# Copy và edit file .env
copy .env.example .env
# Mở .env và điền API keys

# Chạy script tự động (Windows)
start_backend.bat

# Hoặc manual:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run_migrations.py
python main.py
```

✅ Backend chạy tại: http://localhost:8000

### Bước 3️⃣: Chạy Frontend (2 phút)
```bash
# Mở terminal mới
cd fe

# Chạy script tự động (Windows)
start_frontend.bat

# Hoặc manual:
npm install
npm start
```

✅ Frontend chạy tại: http://localhost:3000

---

## 🎉 Xong! Giờ test thử

### Test 1: Gửi message
1. Mở http://localhost:3000
2. Type "Xin chào!" vào ô input
3. Click "Send"
4. Đợi AI response và audio play
5. Xem avatar animate! 🤖

### Test 2: Xem history
1. Click nút 📜 ở góc trái
2. Xem danh sách conversations
3. Click vào 1 conversation

### Test 3: Settings
1. Đổi voice sang "Shimmer"
2. Đổi language sang "Vietnamese"
3. Gửi message mới

---

## 📝 File .env quan trọng

### Backend (.env)
```env
# 100% FREE - Không cần credit card!
GROQ_API_KEY=gsk_your_groq_key_here
DATABASE_URL=postgresql://postgres:password@localhost:5432/human_ai_learning
CHROMA_DB_PATH=../db/chroma_db
AUDIO_STORAGE_PATH=./audio_files
```

**Lấy Groq API Key FREE:**
1. Vào https://console.groq.com/
2. Sign in with Google
3. Vào https://console.groq.com/keys
4. Create API Key → Copy
5. Paste vào .env

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 🐛 Gặp lỗi?

### Lỗi database
```bash
# Kiểm tra PostgreSQL chạy chưa
# Windows:
services.msc  # Tìm PostgreSQL

# Verify connection
psql -U postgres -d human_ai_learning
```

### Lỗi "OpenAI API"
- Check API key đúng chưa
- Verify có credit trong account OpenAI
- Thử: https://platform.openai.com/api-keys

### Lỗi "Module not found"
```bash
# Backend
cd be
pip install -r requirements.txt --force-reinstall

# Frontend
cd fe
rm -rf node_modules
npm install
```

### Avatar không hiện
- Refresh page (Ctrl + F5)
- Check browser console (F12)
- Thử Chrome browser

---

## 💡 Tips

### Để dev nhanh hơn:
1. Mở 2 terminals (1 backend, 1 frontend)
2. Để cả 2 chạy song song
3. Backend reload auto khi code thay đổi
4. Frontend hot reload tự động

### Xem logs:
- **Backend logs**: Terminal chạy backend
- **Frontend logs**: Browser Console (F12)
- **Database logs**: PostgreSQL logs

### Test APIs:
- Swagger UI: http://localhost:8000/docs
- Test trực tiếp API ở đây

---

## 📊 Kiểm tra hoạt động

### ✅ Backend OK khi:
- Terminal shows "Uvicorn running on http://0.0.0.0:8000"
- http://localhost:8000/health returns JSON
- http://localhost:8000/docs shows Swagger UI

### ✅ Frontend OK khi:
- Terminal shows "Compiled successfully"
- Browser mở http://localhost:3000
- Thấy avatar và input box

### ✅ Database OK khi:
- Migrations chạy không lỗi
- Backend logs không có DB errors
- Có thể tạo session mới

---

## 🎯 Tính năng chính

| Tính năng | Cách test |
|-----------|----------|
| **Text Chat** | Type message → Send |
| **Voice Input** | Click 🎤 → Upload audio file |
| **AI Response** | Tự động sau khi send |
| **Audio Playback** | Click ▶️ trên message |
| **Avatar Animation** | Xem avatar khi AI nói |
| **Chat History** | Click 📜 |
| **New Session** | Click "New Chat" |
| **Settings** | Đổi voice/language |

---

## 📱 Giao diện

```
┌─────────────────────────────────────┐
│  📜     Human-AI Learning Platform  │  ← Header
├─────────────────────────────────────┤
│                                     │
│         [  3D Avatar  ]             │  ← Avatar 3D
│                                     │
├─────────────────────────────────────┤
│      [  Audio Player  ]             │  ← Audio controls
├─────────────────────────────────────┤
│  👤 User: Hello!                    │
│  🤖 AI: Hi! How can I help?         │  ← Chat messages
├─────────────────────────────────────┤
│  [ Type message... ]                │  ← Input
│  [📤 Send]  [🎤 Voice]              │  ← Actions
└─────────────────────────────────────┘
```

---

## 🔄 Workflow hoàn chỉnh

1. **User** → Type message
2. **Frontend** → POST /api/chat/message
3. **Backend** → LangChain (AI response)
4. **Backend** → OpenAI TTS (convert to audio)
5. **Backend** → Save to PostgreSQL
6. **Backend** → Return JSON (text + audio URL)
7. **Frontend** → Display message
8. **Frontend** → Play audio
9. **Frontend** → Animate avatar
10. **User** → Enjoy! 🎉

---

## 🎓 Học thêm

### Xem code:
- **TTS**: `be/app/services/tts_service.py`
- **Chat**: `be/app/routes/chat.py`
- **Avatar**: `fe/src/components/Avatar3D.jsx`
- **Main**: `fe/src/pages/MainPage.jsx`

### Tài liệu:
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- Three.js: https://threejs.org/

---

## ✨ Hoàn thành!

Nếu mọi thứ chạy OK:
- ✅ Backend running
- ✅ Frontend running
- ✅ Database connected
- ✅ Có thể chat với AI
- ✅ Avatar animate
- ✅ Audio playing

**Chúc mừng! Bạn đã setup xong Ngày 11! 🎊**

---

**Tips cuối:** 
- Save API keys cẩn thận
- Không commit .env files
- Backup database thường xuyên
- Test mỗi feature trước khi customize

**Gặp vấn đề?** Đọc `SETUP_GUIDE.md` để troubleshooting chi tiết hơn.

