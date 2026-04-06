// server/models/User.js
// Defines the User schema and model.
// Passwords are stored as bcrypt hashes — never plain text.

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,           // Creates a MongoDB unique index
      lowercase: true,        // Always store emails in lowercase
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // select: false means password won't be returned by default in queries.
      // We'll use .select('+password') only when we need to verify it.
      select: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
)

// ── Pre-save hook: hash password before storing ───────────────────────────────
// This runs automatically every time a user document is saved.
// We check isModified to avoid re-hashing an already-hashed password
// when updating other fields (e.g., name).
userSchema.pre('save', async function (next) {
  // 'this' refers to the current user document being saved
  if (!this.isModified('password')) return next()

  // Salt rounds = 12 → higher = more secure but slower (10–12 is a good balance)
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ── Instance method: compare a plain password with the stored hash ────────────
// Usage: const isMatch = await user.comparePassword(plainTextPassword)
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password)
}

// ── Instance method: return a safe user object (no password) ──────────────────
userSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.__v
  return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User
