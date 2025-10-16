import { useState } from 'react';
import './TodoList.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '学习 Vite', completed: true },
    { id: 2, text: '学习 React', completed: false },
    { id: 3, text: '构建项目', completed: false }
  ]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: input,
          completed: false
        }
      ]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  return (
    <div className="todo-list">
      <h2>待办事项</h2>
      
      <div className="todo-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="添加新任务..."
        />
        <button onClick={addTodo}>添加</button>
      </div>

      <div className="todo-items">
        {todos.map(todo => (
          <div
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </div>
        ))}
      </div>

      <div className="todo-stats">
        <span>总计: {stats.total}</span>
        <span>已完成: {stats.completed}</span>
        <span>待办: {stats.active}</span>
      </div>
    </div>
  );
}

export default TodoList;

