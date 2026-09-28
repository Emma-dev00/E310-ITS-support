const prisma = require('../../config/db');

class EquipmentService {
  async listEquipment() {
    const equipment = await prisma.equipment.findMany({
      orderBy: { assetTag: 'asc' },
    });
    return equipment;
  }

  async getEquipmentById(id) {
    const item = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!item) {
      const error = new Error('Equipment item not found');
      error.status = 404;
      throw error;
    }

    return item;
  }

  async createEquipment({ assetTag, type, location }) {
    if (!assetTag || !type || !location) {
      const error = new Error('Asset tag, type, and location are required');
      error.status = 400;
      throw error;
    }

    const existing = await prisma.equipment.findUnique({
      where: { assetTag: assetTag.trim() },
    });

    if (existing) {
      const error = new Error(`Equipment with asset tag '${assetTag}' already exists`);
      error.status = 409;
      throw error;
    }

    const item = await prisma.equipment.create({
      data: {
        assetTag: assetTag.trim(),
        type: type.trim(),
        location: location.trim(),
      },
    });

    return item;
  }
}

module.exports = new EquipmentService();
