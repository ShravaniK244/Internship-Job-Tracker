// src/pages/JobDetails.jsx
// Detailed view of a single job application

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function JobDetails() {
  const { id } = useParams()
  const { user } = useAuth()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1 style={styles.title}>Job Details</h1>
      </div>
      
      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.companyName}>Company Name</h2>
          <p style={styles.position}>Position Title</p>
          
          <div style={styles.details}>
            <div style={styles.detailItem}>
              <span style={styles.label}>Status:</span>
              <span style={styles.status}>Applied</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Applied Date:</span>
              <span style={styles.value}>Not available</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Location:</span>
              <span style={styles.value}>Not specified</span>
            </div>
          </div>
          
          <div style={styles.notes}>
            <h3 style={styles.notesTitle}>Notes</h3>
            <p style={styles.notesContent}>No notes available for this job application.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '32px'
  },
  backLink: {
    color: 'var(--accent)',
    textDecoration: 'none',
    fontSize: '14px',
    marginBottom: '16px',
    display: 'inline-block'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px'
  },
  companyName: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  position: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    marginBottom: '24px'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)'
  },
  label: {
    fontWeight: '500',
    color: 'var(--text-secondary)'
  },
  value: {
    color: 'var(--text-primary)'
  },
  status: {
    background: 'var(--status-applied-bg)',
    color: 'var(--status-applied)',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  notes: {
    marginTop: '24px'
  },
  notesTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '12px'
  },
  notesContent: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6'
  }
}