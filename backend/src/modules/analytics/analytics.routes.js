const express = require('express');
const analyticsController = require('./analytics.controller');
const { authenticate, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Staff, Tech team, and Admin can view their relevant stats
router.get('/dashboard', analyticsController.getDashboardStats);

// SLA detailed metrics are restricted to Technical Team and Admin
router.get(
  '/sla',
  requireRole('TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'),
  analyticsController.getSlaMetrics
);

module.exports = router;
