import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import './App.css';

// Component VoiceVisualizer để hiển thị âm thanh
function VoiceVisualizer({ audioContext, analyser, isRecording }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!analyser || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        
        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;
        
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <div className="voice-visualizer">
      <h4>Voice Activity Detection</h4>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={200}
        className="visualizer-canvas"
      />
    </div>
  );
}

// Component Avatar3D với mouth animation
function Avatar3D({ rmsValue, isVoiceDetected }) {
  const meshRef = useRef();
  const mouthRef = useRef();
  
  useEffect(() => {
    if (meshRef.current && mouthRef.current) {
      // Animation dựa trên RMS value
      const mouthScale = Math.max(0.1, Math.min(1.5, rmsValue / 20));
      mouthRef.current.scale.y = mouthScale;
      
      // Màu sắc thay đổi khi có giọng nói
      if (isVoiceDetected) {
        meshRef.current.material.color.setHex(0x4caf50);
        mouthRef.current.material.color.setHex(0xff6b6b);
      } else {
        meshRef.current.material.color.setHex(0x2196f3);
        mouthRef.current.material.color.setHex(0x666666);
      }
    }
  }, [rmsValue, isVoiceDetected]);

  return (
    <group>
      {/* Head */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#2196f3" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.8]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 1.5, 32]} />
        <meshStandardMaterial color="#1976d2" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.8, -1, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
        <meshStandardMaterial color="#1976d2" />
      </mesh>
      <mesh position={[0.8, -1, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
        <meshStandardMaterial color="#1976d2" />
      </mesh>
    </group>
  );
}

// Component 3D Scene
function Scene3D({ rmsValue, isVoiceDetected }) {
  return (
    <div className="scene-3d">
      <h4>🤖 3D Avatar với Voice Animation</h4>
      <div className="avatar-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Avatar3D rmsValue={rmsValue} isVoiceDetected={isVoiceDetected} />
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>
      <div className="avatar-info">
        <p>Avatar sẽ phản ứng với giọng nói của bạn!</p>
        <div className="avatar-stats">
          <span>RMS: {rmsValue.toFixed(2)}</span>
          <span className={`voice-status ${isVoiceDetected ? 'active' : 'inactive'}`}>
            {isVoiceDetected ? '🎤 Đang nói' : '🔇 Im lặng'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Component AudioRecorder để thu âm
function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordings, setRecordings] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [rmsValue, setRmsValue] = useState(0);
  const [isVoiceDetected, setIsVoiceDetected] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const rmsIntervalRef = useRef(null);

  // Tính RMS để phát hiện giọng nói
  const calculateRMS = (analyser) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / bufferLength);
    return rms;
  };

  // Bắt đầu thu âm với Web Audio API
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Tạo AudioContext và AnalyserNode
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      
      setAudioContext(audioContext);
      setAnalyser(analyser);
      
      // Tạo MediaRecorder
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
          duration: recordingTime,
          rmsValue: rmsValue
        };
        setRecordings(prev => [...prev, newRecording]);
        
        // Dừng stream và audio context
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Bắt đầu đếm thời gian
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Bắt đầu tính RMS
      rmsIntervalRef.current = setInterval(() => {
        const rms = calculateRMS(analyser);
        setRmsValue(rms);
        setIsVoiceDetected(rms > 10); // Threshold để phát hiện giọng nói
      }, 100);
      
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
      clearInterval(rmsIntervalRef.current);
      setRmsValue(0);
      setIsVoiceDetected(false);
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
        
        {/* Voice Detection Status */}
        {isRecording && (
          <div className="voice-detection">
            <div className={`voice-indicator ${isVoiceDetected ? 'voice-active' : 'voice-inactive'}`}>
              <span className="voice-icon">{isVoiceDetected ? '🎤' : '🔇'}</span>
              <span>{isVoiceDetected ? 'Phát hiện giọng nói' : 'Không có giọng nói'}</span>
            </div>
            <div className="rms-meter">
              <span>RMS: {rmsValue.toFixed(2)}</span>
              <div className="rms-bar">
                <div 
                  className="rms-fill" 
                  style={{ width: `${Math.min((rmsValue / 50) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
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

      {/* Voice Visualizer */}
      {isRecording && analyser && (
        <VoiceVisualizer 
          audioContext={audioContext} 
          analyser={analyser} 
          isRecording={isRecording} 
        />
      )}

      {/* 3D Avatar */}
      <Scene3D rmsValue={rmsValue} isVoiceDetected={isVoiceDetected} />

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
