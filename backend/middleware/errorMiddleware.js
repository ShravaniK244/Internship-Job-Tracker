// server/middleware/errorMiddleware.js
// Two middleware functions that together handle all errors gracefully:
//
//   1. notFound   → catches requests to undefined routes (404)
//   2. errorHandler → catches all other errors thrown via next(error)
//
// Both must be registered AFTER all routes in server.js.

// ── 404 Handler ───────────────────────────────────────────────────────────────
// If no route matched, Express falls through to here.
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  error.statusCode = 404
  next(error) // Pass to errorHandler below
}

// ── Global Error Handler ───────────────────────────────────────────────────────
// Express identifies this as an error handler because it has 4 parameters (err, req, res, next).
// It catches:
//   - Errors passed via next(error) from controllers
//   - Unhandled promise rejections (when using express-async-errors or try/catch + next)
//   - Mongoose validation / cast errors
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set on the error
  let statusCode = err.statusCode || err.status || 500
  let message = err.message || 'Internal Server Error'

  // ── Mongoose: Validation error ────────────────────────────────────────────
  // e.g., required field missing, enum value invalid
  if (err.name === 'ValidationError') {
    statusCode = 400
    // Combine all field-level validation messages into one readable string
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('. ')
  }

  // ── Mongoose: Duplicate key (unique index violation) ──────────────────────
  // e.g., registering with an email that already exists
  if (err.code === 11000) {
    statusCode = 409 // Conflict
    const field = Object.keys(err.keyValue)[0]
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} is already registered.`
  }

  // ── Mongoose: Invalid ObjectId (CastError) ────────────────────────────────
  // e.g., GET /api/jobs/not-a-valid-id
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400
    message = `Invalid ID format: "${err.value}"`
  }

  // ── Response ──────────────────────────────────────────────────────────────
  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only during development — never expose in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = { notFound, errorHandler }
