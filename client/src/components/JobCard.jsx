// src/components/JobCard.jsx
// Displays a single job application as a card with edit/delete actions

import React, { useState } from 'react'

// ── Status badge config ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Applied:   { color: 'var(--status-applied)',   bg: 'var(--status-applied-bg)',   icon: '📤' },
  Interview: { color: 'var(--status-interview)', bg: 'var(--status-interview-bg)', icon: '🎯' },
  Offer:     { color: 'var(--status-offer)',     bg: 'var(--status-offer-bg)',     icon: '🎉' },
  Rejected:  { color: 'var(--status-rejected)',  bg: 'var(--status-rejected-bg)',  icon: '✕' },
}

// ── Format date helper ────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      .format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

// ── Days since applied ────────────────────────────────────────────────────────
function daysSince(dateStr) {
  if (!dateStr) return null
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1 day ago'
  return `${diff} days ago`
}

export default function JobCard({ job, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const status = STATUS_CONFIG[job.status] || STATUS_CONFIG.Applied

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    setDeleting(true)
    try {
      await onDelete(job._id || job.id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <article style={styles.card} className="animate-fade">
      {/* Status stripe at top */}
      <div style={{ ...styles.stripe, background: status.color }} />

      <div style={styles.body}>
        {/* Top row: company + status badge */}
        <div style={styles.topRow}>
          {/* Company initial avatar */}
          <div style={{ ...styles.companyAvatar, background: status.bg, color: status.color }}>
            {job.company?.[0]?.toUpperCase() || '?'}
          </div>

          {/* Status badge */}
          <span style={{ ...styles.badge, color: status.color, background: status.bg }}>
            {status.icon} {job.status}
          </span>
        </div>

        {/* Job info */}
        <div style={styles.info}>
          <h3 style={styles.role}>{job.role || job.position || 'Role'}</h3>
          <p style={styles.company}>{job.company}</p>
        </div>

        {/* Meta row */}
        <div style={styles.metaRow}>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>📅</span>
            <span style={styles.metaText}>{formatDate(job.appliedDate || job.date)}</span>
          </div>
          <span style={styles.metaDot} />
          <span style={styles.metaAge}>{daysSince(job.appliedDate || job.date)}</span>
        </div>

        {/* Notes (if any) */}
        {job.notes && (
          <p style={styles.notes} title={job.notes}>
            {job.notes.length > 80 ? `${job.notes.slice(0, 80)}…` : job.notes}
          </p>
        )}

        {/* Action buttons */}
        <div style={styles.actions}>
          <button onClick={() => onEdit(job)} style={styles.editBtn}>
            ✎ Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ ...styles.deleteBtn, ...(confirmDelete ? styles.deleteBtnConfirm : {}) }}
          >
            {deleting ? '…' : confirmDelete ? '⚠ Sure?' : '✕ Delete'}
          </button>
        </div>
      </div>
    </article>
  )
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    display: 'flex', flexDirection: 'column',
  },
  stripe: { height: '3px', width: '100%' },
  body: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  companyAvatar: {
    width: '40px', height: '40px', borderRadius: '10px',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em',
    padding: '4px 10px', borderRadius: '20px',
    textTransform: 'uppercase',
  },
  info: { display: 'flex', flexDirection: 'column', gap: '2px' },
  role: {
    fontFamily: 'var(--font-display)', fontWeight: 700,
    fontSize: '17px', color: 'var(--text-primary)', lineHeight: 1.3,
  },
  company: { fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 400 },
  metaRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '5px' },
  metaIcon: { fontSize: '12px' },
  metaText: { fontSize: '12px', color: 'var(--text-muted)' },
  metaDot: { width: '3px', height: '3px', borderRadius: '50%', background: 'var(--border-light)' },
  metaAge: { fontSize: '12px', color: 'var(--text-muted)' },
  notes: {
    fontSize: '12px', color: 'var(--text-muted)',
    background: 'var(--bg-secondary)', borderRadius: '6px',
    padding: '8px 10px', lineHeight: 1.5,
    borderLeft: '2px solid var(--border-light)',
  },
  actions: { display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' },
  editBtn: {
    flex: 1, background: 'transparent', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 500,
    color: 'var(--text-secondary)', transition: 'var(--transition)', cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1, background: 'transparent', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 500,
    color: 'var(--text-muted)', transition: 'var(--transition)', cursor: 'pointer',
  },
  deleteBtnConfirm: { borderColor: '#ef4444', color: '#f87171', background: 'rgba(239,68,68,0.08)' },
}
