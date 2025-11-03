# 📋 Roadmap Phase 2 - Format 3 Cột

## Ngày 11 (03/11/2025)
**HÔM NAY LÀM GÌ:**
```
Setup môi trường: Python venv, Node.js, PostgreSQL.
Backend: FastAPI cơ bản + Groq chat endpoint (/chat).
Frontend: React chat UI đơn giản, input/output messages.
Database: Tạo table conversations (id, user_message, ai_response, created_at).
```

**NGÀY MAI LÀM GÌ:**
```
Thêm Google TTS: AI response → audio MP3.
Backend: tts_service.py, endpoint /audio/synthesize.
Frontend: AudioPlayer component với play/pause, volume control.
```

**KHÓ KHĂN GẶP PHẢI:**
```
Setup Groq API key (FREE, console.groq.com/keys).
PostgreSQL connection string trong .env.
CORS errors giữa React (3000) và FastAPI (8000).
```

---

## Ngày 12 (04/11/2025)
**HÔM NAY LÀM GÌ:**
```
Thêm Text-to-Speech: tích hợp Google TTS (FREE).
Backend: be/services/tts_service.py, be/routes/audio.py.
Frontend: AudioPlayer component, tự động play audio response.
Lưu file MP3, serve qua static files.
```

**NGÀY MAI LÀM GÌ:**
```
Speech-to-Text: user nói → text.
Frontend: ghi âm microphone (Web Audio API), upload WAV.
Backend: endpoint /audio/transcribe, Groq Whisper hoặc Web Speech API.
```

**KHÓ KHĂN GẶP PHẢI:**
```
Google TTS cần Internet connection.
Audio Player sync timing với messages.
File storage và serving MP3 qua FastAPI.
```

---

## Ngày 13 (05/11/2025)
**HÔM NAY LÀM GÌ:**
```
Speech-to-Text: user nói → transcribe → AI response.
Frontend: VoiceRecorder component, ghi âm microphone.
Backend: stt_service.py, endpoint /audio/transcribe.
Upload WAV file, xử lý, trả về text.
```

**NGÀY MAI LÀM GÌ:**
```
3D Avatar: setup Three.js, load GLTF/FBX model.
Hiển thị avatar cơ bản, idle animation.
Camera controls, lighting setup.
```

**KHÓ KHĂN GẶP PHẢI:**
```
Microphone permission trong browser.
Audio format conversion (WAV).
STT latency cao nếu dùng API.
```

---

## Ngày 14 (06/11/2025)
**HÔM NAY LÀM GÌ:**
```
3D Avatar: tích hợp Three.js + React Three Fiber.
Load simple 3D model (hoặc tạo basic geometry).
Idle animation: head bobbing, breathing motion.
Setup scene, camera, lighting.
```

**NGÀY MAI LÀM GÌ:**
```
Avatar Lip Sync: đồng bộ môi với audio.
Web Audio API analysis: extract frequency data.
Map audio volume → mouth open/close animation.
```

**KHÓ KHĂN GẶP PHẢI:**
```
Three.js bundle size lớn.
GLTF/FBX model cần tìm hoặc tạo.
Performance trên máy yếu.
```

---

## Ngày 15 (07/11/2025)
**HÔM NAY LÀM GÌ:**
```
Avatar Lip Sync: đồng bộ animation với audio.
Web Audio API: analyser node, frequency data.
Map audio amplitude → mouth morph targets.
Smooth transitions, timing sync.
```

**NGÀY MAI LÀM GÍ:**
```
LangChain integration: conversation memory, context.
PostgreSQL models: sessions, conversations tables.
History endpoints: CRUD operations.
```

**KHÓ KHĂN GẶP PHẢI:**
```
Audio analysis timing phức tạp.
Morph targets cần avatar model hỗ trợ.
Sync chính xác audio ↔ animation.
```

---

## Ngày 16 (08/11/2025)
**HÔM NAY LÀM GÌ:**
```
LangChain: tích hợp conversation chain, memory.
PostgreSQL: models (sessions, conversations), migrations.
Backend: history endpoints (GET/POST/DELETE).
Lưu chat history với session management.
```

**NGÀY MAI LÀM GÌ:**
```
Chat History UI: sidebar hiển thị sessions.
Load previous conversations, display messages.
Delete conversations, session management UI.
```

**KHÓ KHĂN GẶP PHẢI:**
```
LangChain memory configuration.
Database schema design cho sessions.
Foreign key relationships PostgreSQL.
```

---

## Ngày 17 (09/11/2025)
**HÔM NAY LÀM GÌ:**
```
Chat History UI: sidebar component, session list.
ConversationView: hiển thị messages dạng chat bubbles.
Load previous conversations từ API.
Delete, search conversations.
```

**NGÀY MAI LÀM GÌ:**
```
Voice Activity Detection (VAD): tự động phát hiện giọng nói.
Real-time audio level monitoring.
Auto start/stop recording khi user nói.
```

**KHÓ KHĂN GẶP PHẢI:**
```
UI state management phức tạp.
Pagination cho nhiều conversations.
Real-time update khi có message mới.
```

---

## Ngày 18 (10/11/2025)
**HÔM NAY LÀM GÌ:**
```
Voice Activity Detection (VAD): phát hiện speech/silence.
Frontend: RMS calculation, threshold detection.
Auto start recording khi detect voice.
Visual feedback: audio level bars.
```

**NGÀY MAI LÀM GÌ:**
```
Learning Features: vocabulary, exercises.
Flashcard system, quiz/test UI.
Progress tracking và statistics.
```

**KHÓ KHĂN GẶP PHẢI:**
```
VAD threshold tuning (noise vs speech).
False positives/negatives.
Real-time processing performance.
```

---

## Ngày 19 (11/11/2025)
**HÔM NAY LÀM GÌ:**
```
Learning Features: vocabulary flashcards, exercises.
Backend: vocabulary API, progress tracking.
Frontend: Flashcard component, quiz/exercise UI.
Lưu user progress vào PostgreSQL.
```

**NGÀY MAI LÀM GÌ:**
```
UI Polish: responsive design, animations.
Loading states, error handling UI.
Mobile-friendly layout.
```

**KHÓ KHĂN GẶP PHẢI:**
```
Vocabulary database schema design.
Quiz logic và scoring system.
Progress tracking algorithm.
```

---

## Ngày 20 (12/11/2025)
**HÔM NAY LÀM GÌ:**
```
UI Polish: responsive CSS, media queries.
Loading spinners, skeleton screens.
Error messages, success notifications.
Smooth animations, transitions.
```

**NGÀY MAI LÀM GÌ:**
```
Performance optimization: caching, indexing.
Database query optimization.
Frontend code splitting, lazy loading.
```

**KHÓ KHĂN GẶP PHẢI:**
```
CSS responsive breakpoints.
Animation performance trên mobile.
Accessibility (a11y) considerations.
```

---

## Ngày 21 (13/11/2025)
**HÔM NAY LÀM GÌ:**
```
Performance: backend caching (Redis hoặc in-memory).
Database indexing, query optimization.
Frontend: code splitting, lazy load components.
Image/asset optimization.
```

**NGÀY MAI LÀM GÌ:**
```
Testing: unit tests (backend), component tests (frontend).
Integration tests, E2E tests.
Bug fixing.
```

**KHÓ KHĂN GẶP PHẢI:**
```
Caching strategy phức tạp.
Database migration cho indexes.
Bundle size vs code splitting trade-offs.
```

---

## Ngày 22 (14/11/2025)
**HÔM NAY LÀM GÌ:**
```
Testing: pytest cho backend, Jest cho frontend.
Unit tests cho services, components.
Integration tests cho API endpoints.
Bug fixes từ testing.
```

**NGÀY MAI LÀM GÌ:**
```
Documentation: API docs, code comments.
User guide, deployment guide.
README updates.
```

**KHÓ KHĂN GẶP PHẢI:**
```
Test coverage đầy đủ.
Mocking dependencies (Groq API, database).
Async testing phức tạp.
```

---

## Ngày 23 (15/11/2025)
**HÔM NAY LÀM GÌ:**
```
Documentation: API documentation (Swagger).
Code comments, docstrings.
User guide với screenshots.
Deployment guide (Docker, cloud).
```

**NGÀY MAI LÀM GÌ:**
```
Deployment: Docker setup, containerization.
Deploy backend (Railway/Render).
Deploy frontend (Vercel/Netlify).
```

**KHÓ KHĂN GẶP PHẢI:**
```
Documentation đầy đủ và rõ ràng.
Screenshots và examples.
Keeping docs up-to-date.
```

---

## Ngày 24 (16/11/2025)
**HÔM NAY LÀM GÌ:**
```
Deployment: Docker container, docker-compose.
Deploy backend lên Railway/Render với PostgreSQL.
Deploy frontend lên Vercel.
Domain, SSL, environment variables.
CI/CD pipeline (GitHub Actions).
```

**NGÀY MAI LÀM GÌ:**
```
Maintenance và monitoring.
User feedback collection.
Feature enhancements.
```

**KHÓ KHĂN GẶP PHẢI:**
```
Docker configuration cho Python + PostgreSQL.
Environment variables cho production.
Database migration trên cloud.
CORS configuration cho production URLs.
```

---

## 📊 Summary Table

| Ngày | Tính năng chính | Build on top of |
|------|----------------|-----------------|
| 11 | Chat cơ bản | - |
| 12 | TTS | Day 11 |
| 13 | STT | Day 11-12 |
| 14 | Avatar 3D | Day 11-13 |
| 15 | Lip Sync | Day 11-14 |
| 16 | LangChain + History DB | Day 11-15 |
| 17 | History UI | Day 11-16 |
| 18 | VAD | Day 11-17 |
| 19 | Learning Features | Day 11-18 |
| 20 | UI Polish | Day 11-19 |
| 21 | Performance | Day 11-20 |
| 22 | Testing | Day 11-21 |
| 23 | Documentation | Day 11-22 |
| 24 | Deployment | Day 11-23 |

---

## 🎯 Principles

1. **Incremental**: Mỗi ngày build THÊM vào ngày trước
2. **Testable**: Code phải chạy được mỗi ngày
3. **Committable**: Mỗi ngày 1 commit riêng
4. **Documented**: Ghi chú code mỗi ngày

**Copy nội dung trên vào Excel/Sheet theo 3 cột!**

