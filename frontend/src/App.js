import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for backend API
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Fetch todos from backend on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newTodo.trim(),
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const newTodoItem = await response.json();
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    } catch (err) {
      setError(err.message);
      console.error('Error adding todo:', err);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      setError(err.message);
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting todo:', err);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <h1>Todo App</h1>
          <p>Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Todo App</h1>
        
        {error && (
          <div className="error" style={{color: 'red', marginBottom: '1rem'}}>
            Error: {error}
            <button onClick={() => setError(null)} style={{marginLeft: '1rem'}}>×</button>
          </div>
        )}

        <form onSubmit={addTodo} className="add-todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button type="submit" className="add-button">
            Add Todo
          </button>
        </form>

        <div className="todos-container">
          {todos.length === 0 ? (
            <p className="no-todos">No todos yet. Add one above!</p>
          ) : (
            <ul className="todos-list">
              {todos.map(todo => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                    aria-label={`Delete ${todo.text}`}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="stats">
          <p>{todos.filter(t => !t.completed).length} of {todos.length} todos remaining</p>
        </div>
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 2rem 1rem;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }
        
        .add-todo-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        
        .todo-input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .todo-input:focus {
          outline: none;
          border-color: #007bff;
        }
        
        .add-button {
          padding: 0.75rem 1.5rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
        }
        
        .add-button:hover {
          background: #0056b3;
        }
        
        .todos-list {
          list-style: none;
          padding: 0;
        }
        
        .todo-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          background: #fafafa;
        }
        
        .todo-item.completed {
          opacity: 0.7;
          background: #f0f0f0;
        }
        
        .todo-content {
          display: flex;
          align-items: center;
          flex: 1;
        }
        
        .todo-checkbox {
          margin-right: 0.75rem;
          transform: scale(1.2);
        }
        
        .todo-text {
          font-size: 1rem;
        }
        
        .todo-text.completed {
          text-decoration: line-through;
          color: #666;
        }
        
        .delete-button {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
        }
        
        .delete-button:hover {
          background: #ffebee;
        }
        
        .no-todos {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 2rem;
        }
        
        .stats {
          margin-top: 2rem;
          text-align: center;
          color: #666;
        }
        
        .error {
          padding: 0.75rem;
          background: #ffebee;
          border: 1px solid #f44336;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
  );
}

export default App;
