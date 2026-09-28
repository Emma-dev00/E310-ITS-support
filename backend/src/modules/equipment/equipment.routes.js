const express = require('express');
const equipmentController = require('./equipment.controller');
const { authenticate, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', equipmentController.listEquipment);
router.get('/:id', equipmentController.getEquipmentById);

router.post(
  '/',
  requireRole('TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'),
  equipmentController.createEquipment
);

module.exports = router;
