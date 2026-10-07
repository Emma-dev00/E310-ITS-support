const authService = require('./auth.service');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async firstTimeLogin(req, res, next) {
    try {
      const { email, temporaryPassword } = req.body;
      const result = await authService.firstTimeLogin(email, temporaryPassword);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword, password, currentPassword } = req.body;
      const targetPassword = newPassword || password;
      let result;
      if (token) {
        result = await authService.resetPasswordWithToken(token, targetPassword);
      } else {
        if (!req.user) {
          const error = new Error('Authentication required or reset token missing');
          error.status = 401;
          throw error;
        }
        result = await authService.resetPassword(req.user.id, currentPassword, targetPassword);
      }
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
