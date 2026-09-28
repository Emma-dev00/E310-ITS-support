const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

// Import modular routes
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const ticketsRoutes = require('./modules/tickets/tickets.routes');
const categoriesRoutes = require('./modules/categories/categories.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const equipmentRoutes = require('./modules/equipment/equipment.routes');

const app = express();

// Middlewares
app.use(cors({
  origin: [env.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount module routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/equipment', equipmentRoutes);

// 404 & Global Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
