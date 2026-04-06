// src/components/JobForm.jsx
// Modal form for adding/editing job applications

import React, { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['Applied', 'Interview', 'Offer', 'Rejected']

export default function JobForm({ initialData, onSubmit, onClose }) {
  const [form, setForm] = useState({
    company: '',
    position: '',
    status: 'Applied',
    location: '',
    notes: '',
    ...initialData
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {initialData ? 'Edit Job' : 'Add New Job'}
          </h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Company</label>
            <input
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              placeholder="Company name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Position</label>
            <input
              name="position"
              type="text"
              value={form.position}
              onChange={handleChange}
              placeholder="Job title"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={styles.select}
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Location</label>
            <input
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="City, State or Remote"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Additional notes about this application..."
              style={styles.textarea}
              rows={4}
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              {initialData ? 'Update' : 'Add'} Job
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    padding: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary)'
  },
  input: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    transition: 'var(--transition)'
  },
  select: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    transition: 'var(--transition)'
  },
  textarea: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    transition: 'var(--transition)',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px'
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    transition: 'var(--transition)'
  },
  submitBtn: {
    background: 'var(--accent)',
    color: '#0a0f1e',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'var(--transition)'
  }
}
