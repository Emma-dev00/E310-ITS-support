const categoriesService = require('./categories.service');

class CategoriesController {
  async listCategories(req, res, next) {
    try {
      const categories = await categoriesService.listCategories();
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const { name } = req.body;
      const category = await categoriesService.createCategory(name);
      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoriesController();
