const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/db');

// Short-lived in-memory user cache to avoid database lookups on every request.
// TTL: 60 seconds (60,000 ms).
const USER_CACHE_TTL_MS = 60 * 1000;
const userCache = new Map();

function invalidateUserCache(userId) {
  if (userId) {
    userCache.delete(userId);
  } else {
    userCache.clear();
  }
}

async function authenticate(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.cookie) {
      const match = req.headers.cookie.match(/(?:^|;\s*)token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const now = Date.now();
    const cached = userCache.get(decoded.userId);
    let user;

    if (cached && cached.expiresAt > now) {
      user = cached.user;
    } else {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          isFirstLogin: true,
        },
      });

      if (!user) {
        userCache.delete(decoded.userId);
        return res.status(401).json({
          success: false,
          message: 'Invalid token: user not found.',
        });
      }

      userCache.set(decoded.userId, {
        user,
        expiresAt: now + USER_CACHE_TTL_MS,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or corrupted token.',
    });
  }
}

function requireRole(...allowedRoles) {
  const roles = allowedRoles.flat();
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  requireRole,
  invalidateUserCache,
};
