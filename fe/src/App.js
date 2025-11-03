/**
 * Day 11: Main App Component
 * Simple chat interface with Groq AI
 */
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    setInput('');
    setLoading(true);
    setError(null);
    
    // Add user message immediately
    const userMsg = {
      role: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    
    try {
      // Call backend
      const response = await axios.post(`${API_URL}/chat`, {
        text: userText
      });
      
      // Add AI response
      const aiMsg = {
        role: 'ai',
        text: response.data.ai_response,
        timestamp: response.data.timestamp,
        id: response.data.conversation_id
      };
      setMessages(prev => [...prev, aiMsg]);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.detail || 'Failed to connect to backend. Make sure it\'s running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🤖 AI Learning Platform</h1>
        <p className="day-badge">Day 11: Foundation</p>
      </header>

      <main className="chat-container">
        <div className="messages-area">
          {messages.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>Start a conversation</h2>
              <p>Type a message below to chat with AI</p>
              <div className="examples">
                <p><strong>Try:</strong></p>
                <button onClick={() => setInput("Hello! How are you?")}>
                  "Hello! How are you?"
                </button>
                <button onClick={() => setInput("Teach me something new")}>
                  "Teach me something new"
                </button>
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">
                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  {msg.timestamp && (
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="message-text">{msg.text}</div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message ai loading">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">AI Assistant</span>
                </div>
                <div className="message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}
        </div>

        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Enter to send)"
            disabled={loading}
            rows={3}
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="send-button"
          >
            {loading ? '⏳' : '📤'} Send
          </button>
        </div>
      </main>

      <footer className="app-footer">
        <p>💡 Day 11: Basic chat with Groq AI (FREE) • No TTS, STT, or Avatar yet</p>
      </footer>
    </div>
  );
}

export default App;

