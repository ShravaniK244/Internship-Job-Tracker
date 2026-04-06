// server/controllers/authController.js
// Handles all authentication logic: register, login, and get current profile.
// Routes stay thin — all business logic lives here.

const jwt = require('jsonwebtoken')
const User = require('../models/User')

// ── Helper: generate a signed JWT ────────────────────────────────────────────
// Encodes the user's _id into the token payload.
// The frontend stores this token and sends it with every protected request.
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },               // payload — keep it minimal
    process.env.JWT_SECRET,        // secret key from .env
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// ── Helper: send a consistent auth response ───────────────────────────────────
const sendAuthResponse = (res, statusCode, user) => {
  const token = generateToken(user._id)

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
    },
  })
}

// ────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Create a new user account
// @access  Public
// ────────────────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // ── Basic input presence check ─────────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      })
    }

    // ── Check for duplicate email ──────────────────────────────────────────
    // We do this manually for a clear error message
    // (the unique index also catches it, but gives a less friendly message)
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    // ── Create the user ────────────────────────────────────────────────────
    // Password hashing happens automatically in the User model's pre-save hook
    const user = await User.create({ name, email, password })

    // ── Respond with token + user data ────────────────────────────────────
    sendAuthResponse(res, 201, user)
  } catch (error) {
    // Pass Mongoose validation errors and others to the global error handler
    next(error)
  }
}

// ────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Authenticate an existing user and return a JWT
// @access  Public
// ────────────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // ── Input check ────────────────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      })
    }

    // ── Find user — include password for comparison ────────────────────────
    // The User model has `select: false` on password,
    // so we must explicitly request it here with .select('+password')
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

    if (!user) {
      // Use a generic message to avoid revealing whether an email is registered
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // ── Compare provided password against the stored hash ──────────────────
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // ── Respond with token + user data ────────────────────────────────────
    sendAuthResponse(res, 200, user)
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Return the currently logged-in user's profile
// @access  Protected (requires valid JWT)
// ────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is set by the authMiddleware — no DB call needed here
  res.status(200).json({
    success: true,
    user: req.user,
  })
}

module.exports = { register, login, getMe }
