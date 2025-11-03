import React, { useRef, useEffect } from 'react';
import './ConversationView.css';

/**
 * Message component - displays a single message bubble
 */
const Message = ({ message, isUser, onPlayAudio }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message ${isUser ? 'user' : 'ai'}`}>
      <div className="message-bubble">
        <div className="message-content">
          {message.user_message && isUser && message.user_message}
          {message.ai_response && !isUser && message.ai_response}
        </div>
        
        {((isUser && message.audio_url_user) || (!isUser && message.audio_url_ai)) && (
          <button 
            className="play-audio-button"
            onClick={() => onPlayAudio(isUser ? message.audio_url_user : message.audio_url_ai)}
            title="Play audio"
          >
            ▶️
          </button>
        )}
      </div>
      
      <div className="message-meta">
        <span className="message-time">
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  );
};

/**
 * ConversationView component - displays chat messages in a scrollable view
 */
const ConversationView = ({ messages, onPlayAudio, isLoading }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  return (
    <div className="conversation-view" ref={containerRef}>
      {isLoading && messages.length === 0 && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading conversation...</p>
        </div>
      )}
      
      {!isLoading && messages.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Start a conversation by typing or speaking</p>
        </div>
      )}
      
      {messages.length > 0 && (
        <div className="messages-container">
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              {/* User message */}
              <Message 
                message={message}
                isUser={true}
                onPlayAudio={onPlayAudio}
              />
              
              {/* AI response */}
              <Message 
                message={message}
                isUser={false}
                onPlayAudio={onPlayAudio}
              />
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ConversationView;

