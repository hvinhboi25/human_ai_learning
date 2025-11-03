import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Avatar3D from '../components/Avatar3D';
import AudioPlayer from '../components/AudioPlayer';
import ConversationView from '../components/ConversationView';
import ChatHistory from '../components/ChatHistory';
import './MainPage.css';

/**
 * MainPage - Main application page integrating all components
 */
const MainPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  // State management
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioData, setAudioData] = useState({ volume: 0, frequencyData: null });
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [voice, setVoice] = useState('com');
  const [language, setLanguage] = useState('en');
  const [useRag, setUseRag] = useState(false);

  // Create new session on mount
  useEffect(() => {
    createNewSession();
  }, []);

  const createNewSession = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/history/sessions`, {
        title: 'New Conversation',
        metadata: {}
      });
      setCurrentSessionId(response.data.id);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/history/sessions/${sessionId}`);
      setCurrentSessionId(sessionId);
      setMessages(response.data.conversations || []);
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat/message`, {
        message: userMessage,
        session_id: currentSessionId,
        voice: voice,
        language: language,
        use_rag: useRag
      });

      // Add message to local state
      const newMessage = {
        id: response.data.conversation_id,
        session_id: response.data.session_id,
        user_message: response.data.user_message,
        ai_response: response.data.ai_response,
        audio_url_user: null,
        audio_url_ai: response.data.ai_audio_url,
        created_at: new Date().toISOString(),
        metadata: response.data.metadata
      };

      setMessages(prev => [...prev, newMessage]);
      setCurrentSessionId(response.data.session_id);

      // Auto-play AI audio response
      if (response.data.ai_audio_url) {
        const fullAudioUrl = `${API_BASE_URL}${response.data.ai_audio_url}`;
        setCurrentAudioUrl(fullAudioUrl);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePlayAudio = (audioUrl) => {
    const fullUrl = audioUrl.startsWith('http') ? audioUrl : `${API_BASE_URL}${audioUrl}`;
    setCurrentAudioUrl(fullUrl);
  };

  const handleAudioAnalysis = (data) => {
    setAudioData(data);
  };

  const handlePlayStateChange = (playing) => {
    setIsAvatarSpeaking(playing);
  };

  const handleVoiceInput = async (audioFile) => {
    if (!audioFile) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('audio_file', audioFile);
      formData.append('session_id', currentSessionId || '');
      formData.append('voice', voice);
      formData.append('language', language);
      formData.append('use_rag', useRag);

      const response = await axios.post(`${API_BASE_URL}/api/chat/voice`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Add message to local state
      const newMessage = {
        id: response.data.conversation_id,
        session_id: response.data.session_id,
        user_message: response.data.user_message,
        ai_response: response.data.ai_response,
        audio_url_user: response.data.metadata?.user_audio_url,
        audio_url_ai: response.data.ai_audio_url,
        created_at: new Date().toISOString(),
        metadata: response.data.metadata
      };

      setMessages(prev => [...prev, newMessage]);
      setCurrentSessionId(response.data.session_id);

      // Auto-play AI audio response
      if (response.data.ai_audio_url) {
        const fullAudioUrl = `${API_BASE_URL}${response.data.ai_audio_url}`;
        setCurrentAudioUrl(fullAudioUrl);
      }
    } catch (error) {
      console.error('Failed to process voice message:', error);
      alert('Failed to process voice message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-page">
      {/* Chat History Sidebar */}
      <ChatHistory
        onSessionSelect={loadSession}
        currentSessionId={currentSessionId}
        apiBaseUrl={API_BASE_URL}
      />

      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <h1>🤖 Human-AI Learning Platform</h1>
          <p>Learn through interactive AI conversations</p>
        </header>

        {/* Avatar Section */}
        <div className="avatar-section">
          <Avatar3D 
            audioData={audioData}
            isPlaying={isAvatarSpeaking}
          />
        </div>

        {/* Audio Player */}
        {currentAudioUrl && (
          <div className="audio-player-section">
            <AudioPlayer
              audioUrl={currentAudioUrl}
              onPlayStateChange={handlePlayStateChange}
              onAudioAnalysis={handleAudioAnalysis}
              autoPlay={true}
            />
          </div>
        )}

        {/* Conversation View */}
        <div className="conversation-section">
          <ConversationView
            messages={messages}
            onPlayAudio={handlePlayAudio}
            isLoading={isLoading && messages.length === 0}
          />
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-container">
            <textarea
              className="message-input"
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              rows={3}
            />
            
            <div className="input-actions">
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                {isLoading ? '⏳' : '📤'} Send
              </button>
              
              <label className="voice-button">
                🎤 Voice
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleVoiceInput(e.target.files[0])}
                  disabled={isLoading}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Settings */}
          <div className="settings-bar">
            <div className="setting-group">
              <label>Accent:</label>
              <select value={voice} onChange={(e) => setVoice(e.target.value)}>
                <option value="com">US English</option>
                <option value="co.uk">UK English</option>
                <option value="com.au">Australian</option>
                <option value="ca">Canadian</option>
                <option value="co.in">Indian</option>
                <option value="ie">Irish</option>
                <option value="co.za">South African</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Language:</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="vi">Vietnamese</option>
              </select>
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={useRag}
                  onChange={(e) => setUseRag(e.target.checked)}
                />
                Use Context (RAG)
              </label>
            </div>

            <button 
              className="new-session-button"
              onClick={createNewSession}
            >
              ➕ New Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

