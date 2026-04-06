// src/pages/Login.jsx
// Login page with email/password form, validation, and error display

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Validation helper ─────────────────────────────────────────────────────────
function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email'
  if (!password) errors.password = 'Password is required'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
  return errors
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Invalid credentials. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Background decoration */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />

      <div style={styles.card} className="animate-fade">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚡</span>
            <span style={styles.logoText}>TrackIt</span>
          </div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your job tracker</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div style={styles.errorBanner}>
            <span>⚠</span> {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              autoComplete="email"
            />
            {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              autoComplete="current-password"
            />
            {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? (
              <><div className="spinner" style={{ width: 16, height: 16 }} /> Signing in…</>
            ) : (
              'Sign in →'
            )}
          </button>
        </form>

        {/* Footer link */}
        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one free</Link>
        </p>
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgOrb1: {
    position: 'fixed', top: '-100px', right: '-100px',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'fixed', bottom: '-120px', left: '-80px',
    width: '350px', height: '350px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%', maxWidth: '420px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    boxShadow: 'var(--shadow)',
    position: 'relative', zIndex: 1,
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  logo: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    marginBottom: '20px',
  },
  logoIcon: { fontSize: '22px' },
  logoText: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: '22px', color: 'var(--accent)', letterSpacing: '-0.5px',
  },
  title: {
    fontFamily: 'var(--font-display)', fontWeight: 700,
    fontSize: '26px', color: 'var(--text-primary)', marginBottom: '6px',
  },
  subtitle: { color: 'var(--text-secondary)', fontSize: '14px' },

  errorBanner: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--radius)', padding: '12px 16px',
    color: '#fca5a5', fontSize: '13px', marginBottom: '20px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },

  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontSize: '13px', fontWeight: 500,
    color: 'var(--text-secondary)', letterSpacing: '0.02em',
  },
  input: {
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '11px 14px',
    color: 'var(--text-primary)', fontSize: '14px',
    transition: 'var(--transition)',
    width: '100%',
  },
  inputError: { borderColor: '#ef4444' },
  fieldError: { color: '#f87171', fontSize: '12px' },

  submitBtn: {
    background: 'var(--accent)', color: '#0a0f1e',
    fontFamily: 'var(--font-display)', fontWeight: 700,
    fontSize: '15px', padding: '13px',
    borderRadius: 'var(--radius)', marginTop: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    transition: 'var(--transition)',
    letterSpacing: '0.01em',
  },

  footerText: {
    textAlign: 'center', fontSize: '13px',
    color: 'var(--text-secondary)', marginTop: '24px',
  },
  link: { color: 'var(--accent)', fontWeight: 500 },
}
