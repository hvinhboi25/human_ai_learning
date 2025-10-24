import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Component AudioRecorder để thu âm
function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordings, setRecordings] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Bắt đầu thu âm
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        // Thêm vào danh sách recordings
        const newRecording = {
          id: Date.now(),
          url: url,
          timestamp: new Date().toLocaleString(),
          duration: recordingTime
        };
        setRecordings(prev => [...prev, newRecording]);
        
        // Dừng stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Bắt đầu đếm thời gian
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Lỗi khi bắt đầu thu âm:', error);
      alert('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  // Dừng thu âm
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(intervalRef.current);
    }
  };

  // Phát lại audio
  const playAudio = (url) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  // Tải xuống file audio
  const downloadAudio = (url, timestamp) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `recording_${timestamp.replace(/[^\w\s]/gi, '')}.wav`;
    link.click();
  };

  // Xóa recording
  const deleteRecording = (id) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
  };

  // Format thời gian
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-recorder">
      <h2>🎤 Audio Recorder</h2>
      <p>Thu âm và quản lý file audio</p>
      
      {/* Controls */}
      <div className="recorder-controls">
        <div className="recording-status">
          {isRecording ? (
            <div className="recording-indicator">
              <div className="pulse"></div>
              <span>Đang thu âm... {formatTime(recordingTime)}</span>
            </div>
          ) : (
            <span>Nhấn nút để bắt đầu thu âm</span>
          )}
        </div>
        
        <div className="control-buttons">
          {!isRecording ? (
            <button onClick={startRecording} className="record-btn">
              🎤 Bắt đầu thu âm
            </button>
          ) : (
            <button onClick={stopRecording} className="stop-btn">
              ⏹️ Dừng thu âm
            </button>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {audioURL && (
        <div className="audio-player">
          <h3>Audio hiện tại:</h3>
          <audio ref={audioRef} controls className="audio-element">
            <source src={audioURL} type="audio/wav" />
            Trình duyệt không hỗ trợ audio.
          </audio>
        </div>
      )}

      {/* Recordings List */}
      <div className="recordings-list">
        <h3>Danh sách bản ghi ({recordings.length})</h3>
        {recordings.length === 0 ? (
          <p className="empty-recordings">Chưa có bản ghi nào</p>
        ) : (
          <div className="recordings-grid">
            {recordings.map(recording => (
              <div key={recording.id} className="recording-item">
                <div className="recording-info">
                  <p className="recording-time">{recording.timestamp}</p>
                  <p className="recording-duration">Thời lượng: {formatTime(recording.duration)}</p>
                </div>
                <div className="recording-actions">
                  <button 
                    onClick={() => playAudio(recording.url)}
                    className="play-btn"
                  >
                    ▶️ Phát
                  </button>
                  <button 
                    onClick={() => downloadAudio(recording.url, recording.timestamp)}
                    className="download-btn"
                  >
                    💾 Tải xuống
                  </button>
                  <button 
                    onClick={() => deleteRecording(recording.id)}
                    className="delete-btn"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Component TodoItem để hiển thị từng todo
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.text}</span>
      <button 
        onClick={() => onDelete(todo.id)}
        className="delete-btn"
      >
        Xóa
      </button>
    </div>
  );
}

// Component chính TodoList
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Thêm todo mới
  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newId = Math.max(...todos.map(t => t.id), 0) + 1;
      setTodos([...todos, { id: newId, text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  // Toggle trạng thái hoàn thành
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Xóa todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-app">
      <h1>Todo List App</h1>
      <p>Ứng dụng thực hành ReactJS cơ bản</p>
      
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Nhập todo mới..."
          className="todo-input"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} className="add-btn">
          Thêm
        </button>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty-message">Chưa có todo nào!</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>

      <div className="stats">
        <p>Tổng số: {todos.length}</p>
        <p>Đã hoàn thành: {todos.filter(t => t.completed).length}</p>
        <p>Chưa hoàn thành: {todos.filter(t => !t.completed).length}</p>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('todo');

  return (
    <div className="App">
      <div className="app-container">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
            onClick={() => setActiveTab('todo')}
          >
            📝 Todo List
          </button>
          <button 
            className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            🎤 Audio Recorder
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'todo' ? <TodoList /> : <AudioRecorder />}
        </div>
      </div>
    </div>
  );
}

export default App;
