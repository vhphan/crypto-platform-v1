const express = require('express');
const cors = require('cors');
const path = require('path');
const cache = require('memory-cache');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Cache middleware
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = cache.get(key);
    if (cachedBody) {
      console.log('Cache hit. Using cache.');
      res.send(cachedBody);
    } else {
      console.log('Cache miss. Fetching from server.');
      res.sendResponse = res.send;
      res.send = (body) => {
        cache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// root route to test
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Apply cache middleware to API routes
const routes = require('./routes')();
app.use('/api', cacheMiddleware(6000), routes);

// Static asset route
app.use('/static', express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
