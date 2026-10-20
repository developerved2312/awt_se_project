import jwt from 'jsonwebtoken';

/**
 * Generate JSON Web Token for authenticated user sessions
 *
 * @param {string} userId - Mongo ObjectId of user
 * @param {string} role - User role ('farmer' | 'officer')
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'haritayan_jwt_secret_gujarat_agri_2026_secure_key';
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;
