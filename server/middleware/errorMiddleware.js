// Middleware to handle 404 Route Not Found errors
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  // If the status code is 200, default it to 500 (internal error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`[Error Handler] Error occurred: ${err.message}`);
  
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
