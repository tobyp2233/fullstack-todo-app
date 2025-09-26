const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Todo Schema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Todo API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const { page = 1, limit = 10, completed, priority, sort = '-createdAt' } = req.query;
    
    const filter = {};
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    
    const todos = await Todo.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
      
    const total = await Todo.countDocuments(filter);
    
    res.json({
      todos,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Get single todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Create new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const todo = new Todo({
      title: title.trim(),
      description: description?.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });
    
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    
    const updateData = {
      updatedAt: new Date()
    };
    
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Toggle todo completion
app.patch('/api/todos/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.completed = !todo.completed;
    todo.updatedAt = new Date();
    
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// Get todo statistics
app.get('/api/stats', async (req, res) => {
  try {
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ completed: true });
    const pending = total - completed;
    
    const priorityStats = await Todo.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      total,
      completed,
      pending,
      priorityStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
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
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
