const express = require('express');
const categoriesController = require('./categories.controller');
const { authenticate, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', categoriesController.listCategories);
router.post(
  '/',
  authenticate,
  requireRole('TECHNICAL_LEAD_ADMIN'),
  categoriesController.createCategory
);

module.exports = router;
