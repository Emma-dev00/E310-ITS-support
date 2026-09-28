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
