// src/pages/Dashboard.jsx
// Main dashboard: displays all job cards, handles filtering, add/edit/delete

import React, { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import JobCard from '../components/JobCard'
import JobForm from '../components/JobForm'
import { jobsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

// ── Status filter tabs ────────────────────────────────────────────────────────
const FILTER_TABS = [
  { label: 'All',       value: 'all',      icon: '◈' },
  { label: 'Applied',   value: 'Applied',   icon: '📤' },
  { label: 'Interview', value: 'Interview', icon: '🎯' },
  { label: 'Offer',     value: 'Offer',     icon: '🎉' },
  { label: 'Rejected',  value: 'Rejected',  icon: '✕' },
]

// ── Stat card config ──────────────────────────────────────────────────────────
function getStats(jobs) {
  return [
    { label: 'Total',     value: jobs.length,                                          color: 'var(--accent)' },
    { label: 'Applied',   value: jobs.filter(j => j.status === 'Applied').length,   color: 'var(--status-applied)' },
    { label: 'Interview', value: jobs.filter(j => j.status === 'Interview').length, color: 'var(--status-interview)' },
    { label: 'Offers',    value: jobs.filter(j => j.status === 'Offer').length,     color: 'var(--status-offer)' },
  ]
}

export default function Dashboard() {
  const { user } = useAuth()

  // ── State ──────────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)  // null = add mode, object = edit mode

  // Search
  const [search, setSearch] = useState('')

  // ── Fetch all jobs ─────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await jobsAPI.getAll()
      // Handle both { jobs: [...] } and direct array responses
      setJobs(Array.isArray(data) ? data : data.jobs || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  // ── Filter + Search logic ──────────────────────────────────────────────────
  const displayedJobs = jobs
    .filter(j => filter === 'all' || j.status === filter)
    .filter(j => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        j.company?.toLowerCase().includes(q) ||
        (j.role || j.position || '').toLowerCase().includes(q) ||
        j.notes?.toLowerCase().includes(q)
      )
    })

  // ── Add job ────────────────────────────────────────────────────────────────
  const handleAdd = async (formData) => {
    const { data } = await jobsAPI.create(formData)
    setJobs(prev => [data.job || data, ...prev])
  }

  // ── Edit job ───────────────────────────────────────────────────────────────
  const handleEdit = (job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleUpdate = async (formData) => {
    const jobId = editingJob._id || editingJob.id
    const { data } = await jobsAPI.update(jobId, formData)
    const updated = data.job || data
    setJobs(prev => prev.map(j => (j._id || j.id) === jobId ? updated : j))
    setEditingJob(null)
  }

  // ── Delete job ─────────────────────────────────────────────────────────────
  const handleDelete = async (jobId) => {
    await jobsAPI.delete(jobId)
    setJobs(prev => prev.filter(j => (j._id || j.id) !== jobId))
  }

  // ── Open form ──────────────────────────────────────────────────────────────
  const openAddForm = () => { setEditingJob(null); setShowForm(true) }
  const closeForm  = () => { setShowForm(false); setEditingJob(null) }

  const stats = getStats(jobs)

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div style={styles.pageHeader} className="animate-fade">
          <div>
            <h1 style={styles.pageTitle}>
              Hey, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p style={styles.pageSubtitle}>
              Track your job applications and stay organized
            </p>
          </div>
          <button onClick={openAddForm} style={styles.addBtn}>
            + New Application
          </button>
        </div>

        {/* ── Stats row ────────────────────────────────────────────────────── */}
        <div style={styles.statsGrid}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ ...styles.statCard, animationDelay: `${i * 60}ms` }} className="animate-fade">
              <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Search + Filter row ───────────────────────────────────────────── */}
        <div style={styles.controlsRow}>
          {/* Search input */}
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search companies, roles, notes…"
              style={styles.searchInput}
            />
            {search && (
              <button onClick={() => setSearch('')} style={styles.clearSearch}>✕</button>
            )}
          </div>

          {/* Filter tabs */}
          <div style={styles.filterTabs}>
            {FILTER_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                style={{
                  ...styles.filterTab,
                  ...(filter === tab.value ? styles.filterTabActive : {}),
                }}
              >
                <span>{tab.icon}</span> {tab.label}
                {tab.value !== 'all' && (
                  <span style={styles.tabCount}>
                    {jobs.filter(j => j.status === tab.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        {loading ? (
          <div style={styles.centerState}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
            <p style={styles.centerText}>Loading your applications…</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <span style={{ fontSize: '32px' }}>⚠️</span>
            <p style={styles.errorTitle}>Couldn't load jobs</p>
            <p style={styles.errorMsg}>{error}</p>
            <button onClick={fetchJobs} style={styles.retryBtn}>↺ Try again</button>
          </div>
        ) : displayedJobs.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '40px' }}>📋</span>
            <p style={styles.emptyTitle}>
              {jobs.length === 0 ? 'No applications yet' : 'No results found'}
            </p>
            <p style={styles.emptyMsg}>
              {jobs.length === 0
                ? 'Start tracking your job hunt by adding your first application.'
                : 'Try adjusting your filter or search query.'}
            </p>
            {jobs.length === 0 && (
              <button onClick={openAddForm} style={styles.addBtn}>
                + Add your first job
              </button>
            )}
          </div>
        ) : (
          <>
            <p style={styles.resultCount}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{displayedJobs.length}</strong> application{displayedJobs.length !== 1 ? 's' : ''}
              {filter !== 'all' ? ` · ${filter}` : ''}
              {search ? ` · "${search}"` : ''}
            </p>
            <div style={styles.grid}>
              {displayedJobs.map((job, i) => (
                <JobCard
                  key={job._id || job.id || i}
                  job={job}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Job Form Modal ────────────────────────────────────────────────── */}
      {showForm && (
        <JobForm
          initialData={editingJob}
          onSubmit={editingJob ? handleUpdate : handleAdd}
          onClose={closeForm}
        />
      )}
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '32px 24px 64px' },

  pageHeader: {
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    marginBottom: '32px', gap: '16px', flexWrap: 'wrap',
  },
  pageTitle: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: '30px', color: 'var(--text-primary)',
    marginBottom: '4px', letterSpacing: '-0.5px',
  },
  pageSubtitle: { color: 'var(--text-secondary)', fontSize: '15px' },
  addBtn: {
    background: 'var(--accent)', color: '#0a0f1e',
    fontFamily: 'var(--font-display)', fontWeight: 700,
    fontSize: '14px', padding: '11px 20px', borderRadius: 'var(--radius)',
    border: 'none', cursor: 'pointer', transition: 'var(--transition)',
    whiteSpace: 'nowrap', flexShrink: 0,
  },

  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px', marginBottom: '28px',
  },
  statCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '18px 20px',
    display: 'flex', flexDirection: 'column', gap: '4px',
  },
  statValue: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', lineHeight: 1 },
  statLabel: { fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' },

  controlsRow: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' },
  searchWrapper: {
    position: 'relative', display: 'flex', alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute', left: '14px',
    color: 'var(--text-muted)', fontSize: '18px', pointerEvents: 'none',
  },
  searchInput: {
    width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '11px 14px 11px 40px',
    color: 'var(--text-primary)', fontSize: '14px',
    transition: 'var(--transition)',
  },
  clearSearch: {
    position: 'absolute', right: '12px',
    background: 'transparent', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px',
  },
  filterTabs: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  filterTab: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '7px 14px', fontSize: '13px',
    color: 'var(--text-secondary)', cursor: 'pointer',
    transition: 'var(--transition)', fontWeight: 500,
  },
  filterTabActive: {
    background: 'var(--accent-dim)', borderColor: 'var(--accent)',
    color: 'var(--accent)',
  },
  tabCount: {
    background: 'var(--bg-secondary)', borderRadius: '10px',
    padding: '1px 6px', fontSize: '11px', fontWeight: 600,
    color: 'var(--text-muted)',
  },

  resultCount: { fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },

  centerState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '16px', padding: '80px 0',
  },
  centerText: { color: 'var(--text-secondary)', fontSize: '14px' },

  errorState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '10px', padding: '60px 0', textAlign: 'center',
  },
  errorTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' },
  errorMsg: { color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '360px' },
  retryBtn: {
    marginTop: '8px', background: 'transparent',
    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: '9px 20px', color: 'var(--text-secondary)',
    fontSize: '14px', cursor: 'pointer', transition: 'var(--transition)',
  },

  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '10px', padding: '60px 0', textAlign: 'center',
  },
  emptyTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)' },
  emptyMsg: { color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '340px', marginBottom: '8px' },
}
