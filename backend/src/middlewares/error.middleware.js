function errorHandler(err, req, res, next) {
  console.error('Unhandled Error:', err);

  // Prisma error handling
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${target} already exists.`,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: err.meta?.cause || 'Requested record was not found.',
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.errors || undefined,
    });
  }

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected internal server error occurred.' 
      : err.message || 'Internal Server Error',
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
