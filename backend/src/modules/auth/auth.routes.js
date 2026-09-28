const express = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/first-time-login', authController.firstTimeLogin);
router.post('/reset-password', authenticate, authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
