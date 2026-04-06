// server/server.js
// Application entry point.
// Responsibilities:
//   1. Load environment variables
//   2. Connect to MongoDB
//   3. Configure Express middleware
//   4. Mount API routes
//   5. Attach error handlers
//   6. Start the HTTP server

const express = require('express')
const cors    = require('cors')
const dotenv  = require('dotenv')

// ── Load .env before anything else ───────────────────────────────────────────
dotenv.config()

const connectDB        = require('./config/db')
const authRoutes       = require('./routes/authRoutes')
const jobRoutes        = require('./routes/jobRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB()

// ── Initialize Express ────────────────────────────────────────────────────────
const app = express()

// ── Global Middleware ─────────────────────────────────────────────────────────

// CORS: allow requests from the React frontend.
// In production, replace the origin with your actual frontend domain.
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))

// Parse incoming JSON request bodies (req.body)
app.use(express.json())

// Parse URL-encoded form data (e.g., from HTML forms)
app.use(express.urlencoded({ extended: false }))

// ── Health check route ────────────────────────────────────────────────────────
// Useful for monitoring, Docker health checks, and quick sanity checks.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Job Tracker API is up and running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ── API Routes ────────────────────────────────────────────────────────────────
// /api/auth  →  Register, Login, Get Profile
app.use('/api/auth', authRoutes)

// /api/jobs  →  Full CRUD for job applications (protected)
app.use('/api/jobs', jobRoutes)

// ── Error Handling Middleware ─────────────────────────────────────────────────
// IMPORTANT: These must be registered AFTER all routes.

// 404 handler — fires when no route matched
app.use(notFound)

// Global error handler — catches errors from all controllers via next(error)
app.use(errorHandler)

// ── Start the Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`)
})

// ── Handle unhandled promise rejections ───────────────────────────────────────
// e.g., if the DB disconnects mid-operation
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection:', reason)
  // Graceful shutdown
  process.exit(1)
})
