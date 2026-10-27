const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'FATAL ERROR: JWT_SECRET is missing from environment variables.'
  );
}

/**
 * Middleware to authenticate requests using JWT tokens.
 * Checks for token validity, single-device revocation (RevokedToken collection),
 * and all-device revocation (User.tokenVersion).
 */
async function authenticateToken(req, res, next) {
  let token = null;

  // 1. Check Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  // 2. Check Cookie if header is not present
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.'
    });
  }

  try {
    // Check if token has been specifically revoked (single-device logout)
    const isRevoked = await RevokedToken.findOne({ token });
    if (isRevoked) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked. Please log in again.'
      });
    }

    // Verify token signature and expiration
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user exists and check token version (all-devices logout)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account no longer exists.'
      });
    }

    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'Session invalidated across all devices. Please log in again.'
      });
    }

    // Check account activation status
    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Access denied.'
      });
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Account is pending administrator approval. Access denied.'
      });
    }

    // Attach decoded info and current token to req
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department ? user.department.toString() : null,
      caseAccessConfig: user.caseAccessConfig
    };
    req.token = token;
    req.tokenExp = decoded.exp;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: error.message
    });
  }
}

/**
 * Role-Based Access Control (RBAC) middleware generator.
 * Restricts access to users having one of the specified roles.
 * Checkpoint: Enforces role verification on backend regardless of client state.
 *
 * @param  {...string} allowedRoles - e.g. 'student', 'officer', 'admin'
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to role verification.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: allowedRoles,
        currentRole: req.user.role
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET
};
