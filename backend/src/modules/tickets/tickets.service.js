const prisma = require('../../config/db');

class TicketsService {
  async createTicket({ userId, categoryId, description, priority, deviceLocation }) {
    if (!categoryId || !description || !priority) {
      const error = new Error('Category, description, and priority are required');
      error.status = 400;
      throw error;
    }

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const normalizedPriority = priority.toUpperCase();
    if (!validPriorities.includes(normalizedPriority)) {
      const error = new Error(`Priority must be one of: ${validPriorities.join(', ')}`);
      error.status = 400;
      throw error;
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      const error = new Error('Invalid category ID provided');
      error.status = 400;
      throw error;
    }

    const ticket = await prisma.$transaction(async (tx) => {
      const newTicket = await tx.ticket.create({
        data: {
          staffId: userId,
          categoryId,
          description,
          priority: normalizedPriority,
          deviceLocation: deviceLocation || null,
          status: 'OPEN',
        },
        include: {
          category: true,
          staff: {
            select: { id: true, email: true, role: true },
          },
        },
      });

      await tx.activityLog.create({
        data: {
          ticketId: newTicket.id,
          userId,
          action: 'Ticket submitted',
        },
      });

      return newTicket;
    });

    return ticket;
  }

  async getTickets({ user, status, priority, categoryId, technicianId, search }) {
    const where = {};

    // Role-based visibility
    if (user.role === 'STAFF') {
      where.staffId = user.id;
    } else if (user.role === 'TECHNICAL_TEAM') {
      where.OR = [
        { technicianId: user.id },
        { technicianId: null },
      ];
    }
    // TECHNICAL_LEAD_ADMIN sees everything — no filter applied
    if (status) {
      where.status = status.toUpperCase();
    }

    if (priority) {
      where.priority = priority.toUpperCase();
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      const searchConditions = [
        { description: { contains: search, mode: 'insensitive' } },
        { deviceLocation: { contains: search, mode: 'insensitive' } },
      ];

      if (where.OR) {
        // Combine with existing role-based OR (e.g. TECHNICAL_TEAM) using AND
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        category: true,
        staff: {
          select: { id: true, email: true },
        },
        technician: {
          select: { id: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tickets;
  }

  async getTicketById(id, user) {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        category: true,
        staff: {
          select: { id: true, email: true, role: true },
        },
        technician: {
          select: { id: true, email: true, role: true },
        },
        activityLogs: {
          include: {
            user: {
              select: { id: true, email: true, role: true },
            },
          },
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!ticket) {
      const error = new Error('Ticket not found');
      error.status = 404;
      throw error;
    }

    // Staff can only view their own tickets
    if (user.role === 'STAFF' && ticket.staffId !== user.id) {
      const error = new Error('Unauthorized to access this ticket');
      error.status = 403;
      throw error;
    }

    return ticket;
  }

  async assignTicket(id, technicianId, assigningUser) {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { technician: true },
    });

    if (!ticket) {
      const error = new Error('Ticket not found');
      error.status = 404;
      throw error;
    }

    const technician = await prisma.user.findUnique({
      where: { id: technicianId },
      select: { id: true, email: true, role: true },
    });

    if (!technician || !['TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'].includes(technician.role)) {
      const error = new Error('Selected technician is invalid or does not have technical privileges');
      error.status = 400;
      throw error;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const newStatus = ticket.status === 'OPEN' ? 'ASSIGNED' : ticket.status;

      const updatedTicket = await tx.ticket.update({
        where: { id },
        data: {
          technicianId,
          status: newStatus,
        },
        include: {
          category: true,
          staff: { select: { id: true, email: true } },
          technician: { select: { id: true, email: true } },
        },
      });

      await tx.activityLog.create({
        data: {
          ticketId: id,
          userId: assigningUser.id,
          action: `Assigned to ${technician.email}`,
        },
      });

      return updatedTicket;
    });

    return updated;
  }

  async updateTicketStatus(id, newStatus, user) {
    const validStatuses = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED'];
    const statusUpper = newStatus.toUpperCase();

    if (!validStatuses.includes(statusUpper)) {
      const error = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      error.status = 400;
      throw error;
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      const error = new Error('Ticket not found');
      error.status = 404;
      throw error;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updateData = { status: statusUpper };

      if (statusUpper === 'RESOLVED') {
        updateData.resolvedAt = new Date();
      } else if (['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'REOPENED'].includes(statusUpper)) {
        updateData.resolvedAt = null;
      }

      const updatedTicket = await tx.ticket.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          staff: { select: { id: true, email: true } },
          technician: { select: { id: true, email: true } },
        },
      });

      await tx.activityLog.create({
        data: {
          ticketId: id,
          userId: user.id,
          action: `Status updated from ${ticket.status} to ${statusUpper}`,
        },
      });

      return updatedTicket;
    });

    return updated;
  }
}

module.exports = new TicketsService();
