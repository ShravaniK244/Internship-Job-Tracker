// server/controllers/jobController.js
// Handles all CRUD operations for job applications.
//
// Security model: every query filters by { user: req.user._id }
// This ensures users can NEVER access or modify another user's jobs,
// even if they somehow guess a valid Job ObjectId.

const Job = require('../models/Job')

// ────────────────────────────────────────────────────────────────────────────
// @route   GET /api/jobs
// @desc    Get all jobs for the logged-in user
//          Optional query param: ?status=Interview to filter by status
// @access  Protected
// ────────────────────────────────────────────────────────────────────────────
const getJobs = async (req, res, next) => {
  try {
    // Build the filter object — always scope to the current user
    const filter = { user: req.user._id }

    // Optional: filter by status via query string → GET /api/jobs?status=Offer
    if (req.query.status) {
      filter.status = req.query.status
    }

    // Optional: search by company or role → GET /api/jobs?search=google
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i') // case-insensitive
      filter.$or = [{ company: searchRegex }, { role: searchRegex }]
    }

    // Fetch and sort by most recently applied first
    const jobs = await Job.find(filter).sort({ appliedDate: -1 })

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────────────────────────────────────────
// @route   GET /api/jobs/:id
// @desc    Get a single job by ID (must belong to the logged-in user)
// @access  Protected
// ────────────────────────────────────────────────────────────────────────────
const getJob = async (req, res, next) => {
  try {
    // Filter by BOTH _id and user — prevents accessing other users' jobs
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      })
    }

    res.status(200).json({ success: true, job })
  } catch (error) {
    next(error) // CastError (bad ID format) is handled in errorMiddleware
  }
}

// ────────────────────────────────────────────────────────────────────────────
// @route   POST /api/jobs
// @desc    Create a new job application entry
// @access  Protected
// ────────────────────────────────────────────────────────────────────────────
const createJob = async (req, res, next) => {
  try {
    const { company, role, status, appliedDate, notes } = req.body

    // ── Required field check ───────────────────────────────────────────────
    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company and role are required.',
      })
    }

    // ── Attach the authenticated user's ID ─────────────────────────────────
    // This is what links the job to the user — never trust this from the client
    const job = await Job.create({
      user:        req.user._id,
      company,
      role,
      status:      status || 'Applied',
      appliedDate: appliedDate || Date.now(),
      notes:       notes || '',
    })

    res.status(201).json({
      success: true,
      message: 'Job application added successfully.',
      job,
    })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/jobs/:id
// @desc    Update a job application
// @access  Protected
// ────────────────────────────────────────────────────────────────────────────
const updateJob = async (req, res, next) => {
  try {
    // Only allow specific fields to be updated (prevents overwriting 'user' field)
    const { company, role, status, appliedDate, notes } = req.body

    const allowedUpdates = {}
    if (company !== undefined)     allowedUpdates.company     = company
    if (role !== undefined)        allowedUpdates.role        = role
    if (status !== undefined)      allowedUpdates.status      = status
    if (appliedDate !== undefined) allowedUpdates.appliedDate = appliedDate
    if (notes !== undefined)       allowedUpdates.notes       = notes

    // findOneAndUpdate with user filter → ownership check built in
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // filter
      allowedUpdates,                              // update
      {
        new:           true,  // return the updated document, not the old one
        runValidators: true,  // run schema validators on the new values
      }
    )

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you do not have permission to update it.',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully.',
      job,
    })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/jobs/:id
// @desc    Delete a job application
// @access  Protected
// ────────────────────────────────────────────────────────────────────────────
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({
      _id:  req.params.id,
      user: req.user._id, // ensures only the owner can delete
    })

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you do not have permission to delete it.',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully.',
      deletedJob: job,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob }
