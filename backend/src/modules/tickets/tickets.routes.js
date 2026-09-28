const express = require('express');
const ticketsController = require('./tickets.controller');
const { authenticate, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Create and list tickets
router.post('/', ticketsController.createTicket);
router.get('/', ticketsController.getTickets);
router.get('/:id', ticketsController.getTicketById);

// Assign technician to ticket (Tech Lead / Admin or Tech Team)
router.patch(
  '/:id/assign',
  requireRole('TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'),
  ticketsController.assignTicket
);

// Update ticket status (Tech Team or Admin)
router.patch(
  '/:id/status',
  requireRole('TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'),
  ticketsController.updateTicketStatus
);

module.exports = router;
