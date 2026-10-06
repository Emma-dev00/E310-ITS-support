const bcrypt = require('bcryptjs');
const prisma = require('../../config/db');

class UsersService {
  async listUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isFirstLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            ticketsCreated: true,
            ticketsAssigned: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }

  async listTechnicians() {
    const technicians = await prisma.user.findMany({
      where: {
        role: {
          in: ['TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'],
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        _count: {
          select: {
            ticketsAssigned: {
              where: {
                status: {
                  in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS'],
                },
              },
            },
          },
        },
      },
      orderBy: { email: 'asc' },
    });

    return technicians;
  }

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isFirstLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            ticketsCreated: true,
            ticketsAssigned: true,
          },
        },
      },
    });

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return user;
  }

  async createUser({ email, password, role }) {
    if (!email || !password) {
      const error = new Error('Email and initial temporary password are required');
      error.status = 400;
      throw error;
    }

    const validRoles = ['STAFF', 'TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'];
    const userRole = role && validRoles.includes(role) ? role : 'STAFF';

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      const error = new Error('A user with this email address already exists');
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: userRole,
        isFirstLogin: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isFirstLogin: true,
        createdAt: true,
      },
    });

    return newUser;
  }
  async resetUserPassword(id) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let tempPassword = '';
    for (let i = 0; i < 12; i++) {
      tempPassword += chars[Math.floor(Math.random() * chars.length)];
    }

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        isFirstLogin: true,
      },
    });

    return {
      email: user.email,
      temporaryPassword: tempPassword,
    };
  }
  async updateUserRole(id, role) {
    const validRoles = ['STAFF', 'TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'];
    if (!validRoles.includes(role)) {
      const error = new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
      error.status = 400;
      throw error;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async deleteUser(id) {
    await prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}

module.exports = new UsersService();
