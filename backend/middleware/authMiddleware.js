// server/middleware/authMiddleware.js
// Protects routes by verifying the JWT token on every request.
// If valid, it attaches the decoded user data to req.user so
// downstream controllers know who is making the request.

const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    // ── Step 1: Extract the token from the Authorization header ──────────────
    // Convention: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
    }

    // Split "Bearer eyJhbGci..." → take the second part
    const token = authHeader.split(' ')[1]

    // ── Step 2: Verify and decode the token ───────────────────────────────────
    // jwt.verify throws if the token is expired or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ── Step 3: Fetch the user from the database ──────────────────────────────
    // We look up the user to confirm they still exist and haven't been deleted.
    // We use .select('-password') to explicitly exclude the password hash.
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but the user no longer exists.',
      })
    }

    // ── Step 4: Attach user to request and pass control to the route ──────────
    req.user = user
    next()
  } catch (error) {
    // Handle specific JWT errors with clear messages
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired. Please log in again.' })
    }

    // Generic fallback
    return res.status(401).json({ success: false, message: 'Not authorized.' })
  }
}

module.exports = { protect }
