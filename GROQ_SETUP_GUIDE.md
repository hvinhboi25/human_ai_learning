# 🆓 Groq API Setup Guide - 100% FREE!

## ✨ Tại sao dùng Groq?

### ✅ Hoàn toàn MIỄN PHÍ
- Không cần thẻ credit card
- Không giới hạn thời gian
- Rate limit: 30 requests/phút (đủ demo)

### ⚡ Siêu nhanh
- Nhanh hơn OpenAI 10-20 lần
- Latency thấp
- Response gần như tức thì

### 🎯 Chất lượng cao
- Llama 3 70B (rất mạnh)
- Mixtral 8x7B
- Gemma 7B
- Và nhiều models khác

---

## 📝 Cách lấy Groq API Key

### Bước 1: Đăng ký tài khoản (30 giây)
1. Truy cập: **https://console.groq.com/**
2. Click **"Sign In"** góc phải trên
3. Chọn đăng nhập bằng:
   - Google account (khuyến nghị)
   - GitHub account
4. Xác nhận đăng nhập

### Bước 2: Lấy API Key (30 giây)
1. Sau khi đăng nhập, tự động vào Dashboard
2. Hoặc truy cập: **https://console.groq.com/keys**
3. Click **"Create API Key"**
4. Đặt tên (ví dụ: "Human-AI Learning")
5. Click **"Submit"**
6. **COPY KEY NGAY!** (chỉ hiện 1 lần)

Key sẽ có dạng:
```
gsk_abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop
```

### Bước 3: Paste vào file `.env`

Mở file `be\.env` và paste:

```env
# Groq API Key (FREE)
GROQ_API_KEY=gsk_abcdefghijklmnopqrstuvwxyz...

# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/human_ai_learning

# Paths
CHROMA_DB_PATH=../db/chroma_db
AUDIO_STORAGE_PATH=./audio_files
```

---

## 🎉 Xong! Giờ chạy thử

```bash
cd be
python main.py
```

Bạn sẽ thấy:
```
✓ Database initialized
✓ Audio storage: ./audio_files
✓ ChromaDB path: ../db/chroma_db
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 🧪 Test API

### Test 1: Check health
```bash
curl http://localhost:8000/health
```

Kết quả:
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

### Test 2: Gửi message
Mở http://localhost:3000 và type:
```
Hello, how are you?
```

AI sẽ response bằng **Groq (Llama 3)** và audio bằng **Google TTS** - cả 2 đều FREE!

---

## 📊 Rate Limits (FREE tier)

| Limit | Value | Ghi chú |
|-------|-------|---------|
| **Requests/phút** | 30 | Reset mỗi phút |
| **Requests/ngày** | 14,400 | Reset mỗi ngày |
| **Tokens/phút** | 7,000 | Đủ cho câu dài |
| **Chi phí** | $0 | HOÀN TOÀN MIỄN PHÍ |

**Đủ để:**
- Demo project thoải mái
- Test và development
- Personal projects
- Learning và experiments

---

## 🤖 Models có sẵn (FREE)

### 1. Llama 3 70B (Khuyến nghị) ⭐
```python
model="llama3-70b-8192"
```
- Rất mạnh, thông minh
- Context: 8,192 tokens
- Tốt nhất cho chat

### 2. Mixtral 8x7B
```python
model="mixtral-8x7b-32768"
```
- Context dài: 32,768 tokens
- Tốt cho long conversations

### 3. Llama 3 8B (Nhanh nhất)
```python
model="llama3-8b-8192"
```
- Siêu nhanh
- Nhẹ nhàng
- Đủ tốt cho basic chat

### 4. Gemma 7B
```python
model="gemma-7b-it"
```
- Google model
- Balanced performance

---

## 🔄 So sánh với OpenAI/OpenRouter

| Feature | Groq (FREE) | OpenAI | OpenRouter |
|---------|-------------|--------|-----------|
| **Chi phí** | $0 | $10-20 | $10-20 |
| **Sign up** | 1 phút | 5 phút | 3 phút |
| **Cần card** | ❌ Không | ✅ Cần | ✅ Cần |
| **Tốc độ** | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ |
| **Chất lượng** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Rate limit** | 30/phút | Unlimited | Unlimited |
| **Best for** | Demo, học tập | Production | Production |

**Kết luận:** Groq là lựa chọn tốt nhất để demo và học tập!

---

## 🎯 Troubleshooting

### Lỗi: "API key invalid"
**Giải pháp:**
- Check key bắt đầu bằng `gsk_`
- Không có khoảng trắng ở đầu/cuối
- Copy lại key mới

### Lỗi: "Rate limit exceeded"
**Giải pháp:**
- Đợi 1 phút (reset tự động)
- Giảm tần suất request
- Free tier: 30 requests/phút

### Lỗi: "Model not found"
**Giải pháp:**
- Check model name đúng chưa
- Xem list models: https://console.groq.com/docs/models
- Dùng: `llama3-70b-8192`

---

## 📚 Tài liệu thêm

- **Groq Docs:** https://console.groq.com/docs
- **Models:** https://console.groq.com/docs/models
- **API Reference:** https://console.groq.com/docs/api-reference
- **Playground:** https://console.groq.com/playground

---

## 💡 Tips

### Optimize performance:
1. Dùng `llama3-70b-8192` cho chất lượng
2. Dùng `llama3-8b-8192` cho tốc độ
3. Set `temperature=0.7` cho balanced
4. Cache responses để giảm requests

### Rate limit management:
1. Track số requests/phút
2. Implement retry logic
3. Show loading state cho user
4. Cache frequent queries

---

## ✨ Kết luận

Groq API là lựa chọn **HOÀN HẢO** để:
- ✅ Demo project không tốn tiền
- ✅ Học và thử nghiệm
- ✅ Personal projects
- ✅ MVP và prototypes

**100% FREE, không cần card, sign up 1 phút!** 🎉

---

**Gặp vấn đề?** Open issue hoặc check Groq Discord: https://discord.gg/groq

