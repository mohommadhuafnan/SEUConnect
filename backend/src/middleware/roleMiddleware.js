import { errorResponse } from '../utils/response.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
        403
      );
    }

    next();
  };
};

export const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    // Admins bypass granular permissions
    if (req.user.role === 'admin' || req.user.role === 'systemAdmin') {
      return next();
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return errorResponse(
        res,
        `Forbidden. Required permission: '${permission}'`,
        403
      );
    }

    next();
  };
};
