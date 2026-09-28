const usersService = require('./users.service');

class UsersController {
  async listUsers(req, res, next) {
    try {
      const users = await usersService.listUsers();
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async listTechnicians(req, res, next) {
    try {
      const technicians = await usersService.listTechnicians();
      return res.status(200).json({
        success: true,
        data: technicians,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await usersService.getUserById(req.params.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const newUser = await usersService.createUser({ email, password, role });
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { role } = req.body;
      const updated = await usersService.updateUserRole(req.params.id, role);
      return res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await usersService.deleteUser(req.params.id);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();
