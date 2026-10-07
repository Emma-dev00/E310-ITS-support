const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/db');
const env = require('../../config/env');

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

class AuthService {
  async login(email, password) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    const token = generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
      },
    };
  }

  async firstTimeLogin(email, temporaryPassword) {
    if (!email || !temporaryPassword) {
      const error = new Error('Email and temporary password are required');
      error.status = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    if (!user.isFirstLogin) {
      const error = new Error('User has already completed first-time setup. Please use standard login.');
      error.status = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(temporaryPassword, user.password);
    if (!isMatch) {
      const error = new Error('Invalid temporary password');
      error.status = 401;
      throw error;
    }

    const token = generateToken(user);

    return {
      token,
      requiresPasswordReset: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isFirstLogin: true,
      },
    };
  }

  async resetPassword(userId, currentPassword, newPassword) {
    if (!newPassword || newPassword.length < 8) {
      const error = new Error('New password must be at least 8 characters long');
      error.status = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    // If currentPassword is provided or user is not in first-time mode, verify it
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        const error = new Error('Current password does not match');
        error.status = 400;
        throw error;
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isFirstLogin: false,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isFirstLogin: true,
        updatedAt: true,
      },
    });

    const token = generateToken(updatedUser);

    return {
      message: 'Password updated successfully',
      token,
      user: updatedUser,
    };
  }

  async forgotPassword(email) {
    if (!email) {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    const userModel = prisma.User || prisma.user;
    const user = await userModel.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return {
        message: 'If an account exists with this email, a password reset link has been generated.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = BigInt(Date.now() + 3600 * 1000); // 1 hour expiration

    await userModel.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    const frontendUrl = (env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    console.log(`[PASSWORD RESET] Reset link for ${user.email}: ${resetLink}`);

    return {
      message: 'If an account exists with this email, a password reset link has been generated.',
      resetLink,
    };
  }

  async resetPasswordWithToken(token, newPassword) {
    if (!token) {
      const error = new Error('Reset token is required');
      error.status = 400;
      throw error;
    }

    if (!newPassword || newPassword.length < 8) {
      const error = new Error('New password must be at least 8 characters long');
      error.status = 400;
      throw error;
    }

    const nowEpoch = BigInt(Date.now());
    const userModel = prisma.User || prisma.user;

    // Find the user whose reset_token matches and whose reset_token_expires is greater than current time
    const user = await userModel.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: nowEpoch,
        },
      },
    });

    if (!user) {
      const error = new Error('Invalid or expired password reset token');
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await userModel.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
        isFirstLogin: false,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isFirstLogin: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Password has been reset successfully. You can now log in with your new password.',
      user: updatedUser,
    };
  }

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isFirstLogin: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return user;
  }
}

module.exports = new AuthService();
