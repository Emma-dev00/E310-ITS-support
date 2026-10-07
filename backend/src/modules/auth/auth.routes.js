const express = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

const maybeAuthenticate = (req, res, next) => {
  if (req.body && req.body.token) {
    return next();
  }
  return authenticate(req, res, next);
};

router.post('/login', authController.login);
router.post('/first-time-login', authController.firstTimeLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', maybeAuthenticate, authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
