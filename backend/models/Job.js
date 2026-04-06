// server/models/Job.js
// Defines the Job schema.
// Each job is linked to a specific user via a ObjectId reference.
// This ensures users can only ever see their own jobs.

const mongoose = require('mongoose')

// Allowed values for the status field
const STATUS_VALUES = ['Applied', 'Interview', 'Offer', 'Rejected']

const jobSchema = new mongoose.Schema(
  {
    // Reference to the User who created this job entry.
    // This is the key that enforces data isolation between users.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',              // Tells Mongoose which model to populate from
      required: [true, 'User reference is required'],
      index: true,              // Index for fast queries like "get all jobs for user X"
    },

    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },

    role: {
      type: String,
      required: [true, 'Job role / position is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },

    status: {
      type: String,
      enum: {
        values: STATUS_VALUES,
        message: `Status must be one of: ${STATUS_VALUES.join(', ')}`,
      },
      default: 'Applied',
    },

    appliedDate: {
      type: Date,
      required: [true, 'Applied date is required'],
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    toJSON: { virtuals: true },
  }
)

// ── Compound index: user + status for efficient filtered queries ───────────────
// e.g., GET /api/jobs?status=Interview → uses this index
jobSchema.index({ user: 1, status: 1 })

// ── Compound index: user + appliedDate for sorted queries ─────────────────────
jobSchema.index({ user: 1, appliedDate: -1 })

const Job = mongoose.model('Job', jobSchema)

module.exports = Job
