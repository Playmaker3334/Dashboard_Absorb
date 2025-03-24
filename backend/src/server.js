const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const routes = require('./routes');

// Create Express app
const app = express();

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan(config.environment === 'development' ? 'dev' : 'combined'));

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Absorb Dashboard API is running',
    version: '1.0.0',
    environment: config.environment
  });
});

// Serve static files from the React app - use absolute path
app.use(express.static(path.join(__dirname, '../public')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong',
    code: err.status || 500
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.environment} mode`);
  console.log(`Connecting to Absorb API at: ${config.absorbApiUrl}`);
  console.log(`Static files served from: ${path.join(__dirname, '../public')}`);
});

module.exports = app;