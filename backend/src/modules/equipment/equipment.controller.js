const equipmentService = require('./equipment.service');

class EquipmentController {
  async listEquipment(req, res, next) {
    try {
      const items = await equipmentService.listEquipment();
      return res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEquipmentById(req, res, next) {
    try {
      const item = await equipmentService.getEquipmentById(req.params.id);
      return res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async createEquipment(req, res, next) {
    try {
      const { assetTag, type, location } = req.body;
      const item = await equipmentService.createEquipment({ assetTag, type, location });
      return res.status(201).json({
        success: true,
        message: 'Equipment registered successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EquipmentController();
