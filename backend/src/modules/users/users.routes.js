const express = require('express');
const usersController = require('./users.controller');
const { authenticate, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Technicians can be listed by technical team and admin
router.get(
  '/technicians',
  authenticate,
  requireRole('TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'),
  usersController.listTechnicians
);

// All other user management routes are restricted to TECHNICAL_LEAD_ADMIN
router.get(
  '/',
  authenticate,
  requireRole('TECHNICAL_LEAD_ADMIN'),
  usersController.listUsers
);

router.post(
  '/',
  authenticate,
  requireRole('TECHNICAL_LEAD_ADMIN'),
  usersController.createUser
);

router.get(
  '/:id',
  authenticate,
  requireRole('TECHNICAL_LEAD_ADMIN'),
  usersController.getUserById
);

router.patch(
  '/:id/role',
  authenticate,
  requireRole('TECHNICAL_LEAD_ADMIN'),
  usersController.updateUserRole
);

router.delete(
  '/:id',
  authenticate,
  requireRole('TECHNICAL_LEAD_ADMIN'),
  usersController.deleteUser
);

module.exports = router;
