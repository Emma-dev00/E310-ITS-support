const express = require('express');
const categoriesController = require('./categories.controller');
const { authenticate, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();
 
router.use(authenticate);
 
router.get('/', categoriesController.listCategories);
router.post(
  '/',
  requireRole('TECHNICAL_LEAD_ADMIN'),
  categoriesController.createCategory
);

module.exports = router;
