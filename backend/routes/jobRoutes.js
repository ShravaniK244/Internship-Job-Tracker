// server/routes/jobRoutes.js
// Defines URL patterns for job application endpoints.
// All routes are protected - require authentication.

const express = require('express')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// All job routes require authentication
router.use(protect)

// GET /api/jobs  →  Get all jobs for the authenticated user
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job routes working - user authenticated',
    user: req.user.id
  })
})

// POST /api/jobs  →  Create a new job application
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create job endpoint - placeholder'
  })
})

module.exports = router