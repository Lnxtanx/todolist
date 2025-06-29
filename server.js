const express = require('express');
const cors = require('cors');
const next = require('next');
const compression = require('compression');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// In-memory data store
let tasks = [
  {
    id: 1,
    title: "Complete MERN assignment",
    completed: false
  },
  {
    id: 2,
    title: "Learn Next.js",
    completed: true
  }
];

let nextId = 3;

app.prepare().then(() => {
  const server = express();

  // Performance optimizations
  server.use(compression()); // Enable gzip compression
  server.use(cors());
  server.use(express.json({ limit: '1mb' })); // Limit payload size

  // Cache static assets for 1 year
  server.use('/_next/static', express.static('node_modules/next/dist/client', {
    maxAge: '1y',
    immutable: true
  }));

  // Cache API responses for 5 minutes
  const cache = new Map();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getCachedResponse = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  const setCachedResponse = (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  };

  // API Routes with caching
  // GET /api/tasks - Fetch all tasks
  server.get('/api/tasks', (req, res) => {
    try {
      // Check cache first
      const cached = getCachedResponse('tasks');
      if (cached) {
        return res.json(cached);
      }

      // Set cache headers
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      
      const data = tasks;
      setCachedResponse('tasks', data);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  // POST /api/tasks - Add a new task
  server.post('/api/tasks', (req, res) => {
    try {
      const { title, completed = false } = req.body;
      
      // Validation
      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Task title is required' });
      }
      
      const newTask = {
        id: nextId++,
        title: title.trim(),
        completed: Boolean(completed)
      };
      
      tasks.push(newTask);
      
      // Clear cache since data changed
      cache.delete('tasks');
      
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // PUT /api/tasks/:id - Update task completion status
  server.put('/api/tasks/:id', (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      // Toggle the completed status
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      
      // Clear cache since data changed
      cache.delete('tasks');
      
      res.json(tasks[taskIndex]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // DELETE /api/tasks/:id - Delete a task
  server.delete('/api/tasks/:id', (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      const deletedTask = tasks.splice(taskIndex, 1)[0];
      
      // Clear cache since data changed
      cache.delete('tasks');
      
      res.json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  // Health check endpoint
  server.get('/api/health', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.json({ status: 'OK', message: 'Todo API is running' });
  });

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`⚡ Performance optimizations enabled`);
  });
}); 