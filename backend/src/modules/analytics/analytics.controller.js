const analyticsService = require('./analytics.service');

class AnalyticsController {
  async getDashboardStats(req, res, next) {
    try {
      const stats = await analyticsService.getDashboardStats(req.user);
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSlaMetrics(req, res, next) {
    try {
      const metrics = await analyticsService.getSlaMetrics();
      return res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
