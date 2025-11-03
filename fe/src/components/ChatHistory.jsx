import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatHistory.css';

/**
 * ChatHistory component - displays list of conversation sessions
 */
const ChatHistory = ({ onSessionSelect, currentSessionId, apiBaseUrl = 'http://localhost:8000' }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${apiBaseUrl}/api/history/sessions`, {
        params: {
          limit: 50,
          offset: 0
        }
      });
      
      setSessions(response.data);
    } catch (err) {
      setError('Failed to load chat history');
      console.error('Error loading sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionClick = (sessionId) => {
    if (onSessionSelect) {
      onSessionSelect(sessionId);
    }
    setIsOpen(false);
  };

  const handleDeleteSession = async (sessionId, event) => {
    event.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return;
    }
    
    try {
      await axios.delete(`${apiBaseUrl}/api/history/sessions/${sessionId}`);
      
      // Remove from local state
      setSessions(sessions.filter(s => s.id !== sessionId));
      
      // If deleted session was current, notify parent
      if (currentSessionId === sessionId && onSessionSelect) {
        onSessionSelect(null);
      }
    } catch (err) {
      console.error('Error deleting session:', err);
      alert('Failed to delete session');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`chat-history ${isOpen ? 'open' : ''}`}>
      <button 
        className="history-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat History"
      >
        📜
      </button>
      
      <div className="history-panel">
        <div className="history-header">
          <h2>Chat History</h2>
          <button 
            className="close-button"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="history-content">
          {isLoading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading history...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <p>❌ {error}</p>
              <button onClick={loadSessions}>Retry</button>
            </div>
          )}
          
          {!isLoading && !error && sessions.length === 0 && (
            <div className="empty-state">
              <p>💬 No conversations yet</p>
              <span>Start chatting to create history</span>
            </div>
          )}
          
          {!isLoading && !error && sessions.length > 0 && (
            <div className="sessions-list">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
                  onClick={() => handleSessionClick(session.id)}
                >
                  <div className="session-icon">💬</div>
                  
                  <div className="session-info">
                    <div className="session-title">
                      {session.title || 'Untitled Conversation'}
                    </div>
                    <div className="session-preview">
                      {session.preview_message || 'No messages'}
                    </div>
                    <div className="session-meta">
                      <span className="session-date">
                        {formatDate(session.created_at)}
                      </span>
                      <span className="session-count">
                        {session.message_count} messages
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className="delete-button"
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    title="Delete conversation"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="history-footer">
          <button 
            className="refresh-button"
            onClick={loadSessions}
            disabled={isLoading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatHistory;

