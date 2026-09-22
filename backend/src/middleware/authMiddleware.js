import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/response.js';

export const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Authentication required. No token provided.', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return errorResponse(res, 'Session expired or invalid token. Please log in again.', 401);
  }

  try {
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return errorResponse(res, 'User account no longer exists.', 401);
    }

    if (user.status !== 'active') {
      return errorResponse(res, `Account is currently ${user.status}. Please contact the Faculty Administrator.`, 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication error: ' + error.message, 500);
  }
};
