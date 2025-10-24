import React, { useState } from 'react';
import './App.css';

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
  const [todos, setTodos] = useState([
    
  ]);
  
  const [newTodo, setNewTodo] = useState('');

  // Thêm todo mới
  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newId = Math.max(...todos.map(t => t.id)) + 1;
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
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
