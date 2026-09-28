const prisma = require('../../config/db');

class CategoriesService {
  async listCategories() {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    return categories;
  }

  async createCategory(name) {
    if (!name || !name.trim()) {
      const error = new Error('Category name is required');
      error.status = 400;
      throw error;
    }

    const trimmed = name.trim();
    const existing = await prisma.category.findUnique({
      where: { name: trimmed },
    });

    if (existing) {
      const error = new Error('A category with this name already exists');
      error.status = 409;
      throw error;
    }

    const category = await prisma.category.create({
      data: { name: trimmed },
    });

    return category;
  }
}

module.exports = new CategoriesService();
