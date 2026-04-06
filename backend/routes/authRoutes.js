// server/routes/authRoutes.js
// Defines URL patterns for authentication endpoints.
// Routes are intentionally thin — logic lives in the controller.

const express = require('express')
const { register, login, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// POST /api/auth/register  →  Create a new account
router.post('/register', register)

// POST /api/auth/login  →  Login and receive a JWT
router.post('/login', login)

// GET /api/auth/me  →  Get the currently logged-in user's profile
// 'protect' middleware runs first, verifies the token, then calls getMe
router.get('/me', protect, getMe)

module.exports = router
