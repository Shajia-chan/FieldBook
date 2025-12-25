// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const weatherRoutes = require("./routes/weather.routes");
const staffRoutes = require('./routes/staff.route');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/weather", weatherRoutes);
app.use('/api/staff', staffRoutes);
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking';

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// Import Routes
const fieldRoutes = require('./routes/field.route');

// API Routes
app.use('/api/fields', fieldRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Football Field Booking API',
    version: '1.0.0',
    status: 'Server is running',
    endpoints: {
      getAllFields: 'GET /api/fields',
      searchFields: 'GET /api/fields/search',
      getFieldById: 'GET /api/fields/:id',
      createField: 'POST /api/fields',
      updateField: 'PUT /api/fields/:id',
      deleteField: 'DELETE /api/fields/:id',
      fieldsWithPool: 'GET /api/fields/swimming-pool'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});



// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 Server is running!');
  console.log(`📝 API: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`🔍 Fields: http://localhost:${PORT}/api/fields`);
  console.log('========================================\n');
});