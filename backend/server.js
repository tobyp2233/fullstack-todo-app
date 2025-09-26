const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for todos (in production, you'd use a database)
let todos = [
  {
    id: 1,
    text: 'Learn React',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    text: 'Build a todo app',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// Routes

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST /api/todos - Create a new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  const newTodo = {
    id: nextId++,
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id - Update a todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  // Update todo properties
  if (text !== undefined) {
    todos[todoIndex].text = text.trim();
  }
  
  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }
  
  todos[todoIndex].updatedAt = new Date().toISOString();
  
  res.json(todos[todoIndex]);
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  res.json(deletedTodo);
});

// DELETE /api/todos - Delete all completed todos
app.delete('/api/todos', (req, res) => {
  const completedTodos = todos.filter(todo => todo.completed);
  todos = todos.filter(todo => !todo.completed);
  
  res.json({
    message: `Deleted ${completedTodos.length} completed todos`,
    deletedTodos: completedTodos
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Todo API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /api/todos       - Get all todos');
  console.log('  POST   /api/todos       - Create a new todo');
  console.log('  PUT    /api/todos/:id   - Update a todo');
  console.log('  DELETE /api/todos/:id   - Delete a todo');
  console.log('  DELETE /api/todos       - Delete all completed todos');
  console.log('  GET    /health          - Health check');
});

module.exports = app;
