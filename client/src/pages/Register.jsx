// src/pages/Register.jsx
// Registration page with name/email/password validation

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Validation ────────────────────────────────────────────────────────────────
function validate({ name, email, password, confirmPassword }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Full name is required'
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters'

  if (!email.trim()) errors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email'

  if (!password) errors.password = 'Password is required'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters'

  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password'
  else if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match'

  return errors
}

// ── Password strength indicator ───────────────────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)]
    .filter(Boolean).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            height: '3px', flex: 1, borderRadius: '2px',
            background: i <= score ? colors[score] : 'var(--border)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
      <span style={{ fontSize: '11px', color: colors[score] }}>{labels[score]}</span>
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
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
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />

      <div style={styles.card} className="animate-fade">
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚡</span>
            <span style={styles.logoText}>TrackIt</span>
          </div>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>Start tracking your job applications</p>
        </div>

        {serverError && (
          <div style={styles.errorBanner}>
            <span>⚠</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Name */}
          <div style={styles.field}>
            <label style={styles.label}>Full name</label>
            <input
              name="name" type="text" value={form.name} onChange={handleChange}
              placeholder="Jane Smith"
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              autoComplete="name"
            />
            {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="jane@example.com"
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              autoComplete="email"
            />
            {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="Min. 6 characters"
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              autoComplete="new-password"
            />
            <PasswordStrength password={form.password} />
            {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div style={styles.field}>
            <label style={styles.label}>Confirm password</label>
            <input
              name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
              placeholder="Repeat your password"
              style={{ ...styles.input, ...(errors.confirmPassword ? styles.inputError : {}) }}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span style={styles.fieldError}>{errors.confirmPassword}</span>}
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? (
              <><div className="spinner" style={{ width: 16, height: 16 }} /> Creating account…</>
            ) : (
              'Create account →'
            )}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '24px',
    position: 'relative', overflow: 'hidden',
  },
  bgOrb1: {
    position: 'fixed', top: '-80px', left: '-80px',
    width: '380px', height: '380px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'fixed', bottom: '-100px', right: '-60px',
    width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%', maxWidth: '440px',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '40px',
    boxShadow: 'var(--shadow)', position: 'relative', zIndex: 1,
  },
  header: { textAlign: 'center', marginBottom: '28px' },
  logo: { display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  logoIcon: { fontSize: '22px' },
  logoText: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: '22px', color: 'var(--accent)',
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
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' },
  input: {
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '11px 14px',
    color: 'var(--text-primary)', fontSize: '14px',
    transition: 'var(--transition)', width: '100%',
  },
  inputError: { borderColor: '#ef4444' },
  fieldError: { color: '#f87171', fontSize: '12px' },
  submitBtn: {
    background: 'var(--accent)', color: '#0a0f1e',
    fontFamily: 'var(--font-display)', fontWeight: 700,
    fontSize: '15px', padding: '13px', borderRadius: 'var(--radius)',
    marginTop: '4px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', transition: 'var(--transition)',
  },
  footerText: { textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px' },
  link: { color: 'var(--accent)', fontWeight: 500 },
}