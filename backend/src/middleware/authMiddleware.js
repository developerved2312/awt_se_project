import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect middleware - Requires a valid Bearer JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'haritayan_jwt_secret_gujarat_agri_2026_secure_key';
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User associated with this token no longer exists',
        });
      }

      return next();
    } catch (error) {
      console.error('⚠️ [Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no bearer token provided',
    });
  }
};

/**
 * Optional Auth middleware - If token is provided, attaches req.user; otherwise continues
 */
export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'haritayan_jwt_secret_gujarat_agri_2026_secure_key';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

/**
 * Officer role guard - Ensures the authenticated user is an Agricultural Officer
 */
export const requireOfficer = (req, res, next) => {
  if (req.user && req.user.role === 'officer') {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: 'Access restricted: Agricultural Officer authorization required',
  });
};
