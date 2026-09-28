const ticketsService = require('./tickets.service');

class TicketsController {
  async createTicket(req, res, next) {
    try {
      const { categoryId, description, priority, deviceLocation } = req.body;
      const ticket = await ticketsService.createTicket({
        userId: req.user.id,
        categoryId,
        description,
        priority,
        deviceLocation,
      });

      return res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTickets(req, res, next) {
    try {
      const { status, priority, categoryId, technicianId, search } = req.query;
      const tickets = await ticketsService.getTickets({
        user: req.user,
        status,
        priority,
        categoryId,
        technicianId,
        search,
      });

      return res.status(200).json({
        success: true,
        count: tickets.length,
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTicketById(req, res, next) {
    try {
      const ticket = await ticketsService.getTicketById(req.params.id, req.user);
      return res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async assignTicket(req, res, next) {
    try {
      const { technicianId } = req.body;
      if (!technicianId) {
        return res.status(400).json({
          success: false,
          message: 'Technician ID is required',
        });
      }

      const updated = await ticketsService.assignTicket(req.params.id, technicianId, req.user);
      return res.status(200).json({
        success: true,
        message: 'Ticket assigned successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTicketStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
        });
      }

      const updated = await ticketsService.updateTicketStatus(req.params.id, status, req.user);
      return res.status(200).json({
        success: true,
        message: 'Ticket status updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TicketsController();
