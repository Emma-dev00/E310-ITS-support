const prisma = require('../../config/db');

class AnalyticsService {
  async getDashboardStats(user) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const baseWhere = user.role === 'STAFF' ? { staffId: user.id } : {};

    const [
      totalCount,
      openCount,
      assignedCount,
      inProgressCount,
      resolvedCount,
      closedCount,
      resolvedThisMonthCount,
    ] = await Promise.all([
      prisma.ticket.count({ where: baseWhere }),
      prisma.ticket.count({ where: { ...baseWhere, status: 'OPEN' } }),
      prisma.ticket.count({ where: { ...baseWhere, status: 'ASSIGNED' } }),
      prisma.ticket.count({ where: { ...baseWhere, status: 'IN_PROGRESS' } }),
      prisma.ticket.count({ where: { ...baseWhere, status: 'RESOLVED' } }),
      prisma.ticket.count({ where: { ...baseWhere, status: 'CLOSED' } }),
      prisma.ticket.count({
        where: {
          ...baseWhere,
          status: 'RESOLVED',
          resolvedAt: { gte: startOfMonth },
        },
      }),
    ]);

    return {
      total: totalCount,
      open: openCount,
      assigned: assignedCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
      closed: closedCount,
      resolvedThisMonth: resolvedThisMonthCount,
    };
  }

  async getSlaMetrics() {
    const [
      byPriority,
      byCategory,
      technicianLoads,
    ] = await Promise.all([
      prisma.ticket.groupBy({
        by: ['priority'],
        _count: { id: true },
      }),
      prisma.ticket.groupBy({
        by: ['categoryId'],
        _count: { id: true },
      }),
      prisma.user.findMany({
        where: {
          role: { in: ['TECHNICAL_TEAM', 'TECHNICAL_LEAD_ADMIN'] },
        },
        select: {
          id: true,
          email: true,
          _count: {
            select: {
              ticketsAssigned: {
                where: {
                  status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
                },
              },
            },
          },
        },
      }),
    ]);

    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

    const formattedByCategory = byCategory.map((item) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap[item.categoryId] || 'Unknown',
      count: item._count.id,
    }));

    const formattedByPriority = byPriority.map((item) => ({
      priority: item.priority,
      count: item._count.id,
    }));

    return {
      byPriority: formattedByPriority,
      byCategory: formattedByCategory,
      technicians: technicianLoads.map((t) => ({
        id: t.id,
        email: t.email,
        activeTicketsCount: t._count.ticketsAssigned,
      })),
    };
  }
}

module.exports = new AnalyticsService();
