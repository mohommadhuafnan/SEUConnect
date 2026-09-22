import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return errorResponse(res, 'Validation Error: ' + messages.join(', '), 400);
  }

  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `Duplicate field value entered for '${field}'. Must be unique.`, 400);
  }

  if (err.name === 'MulterError') {
    return errorResponse(res, `File upload error: ${err.message}`, 400);
  }

  return errorResponse(res, err.message || 'Internal Server Error', err.status || 500);
};

export const notFound = (req, res, next) => {
  return errorResponse(res, `Endpoint Not Found: ${req.originalUrl}`, 404);
};
