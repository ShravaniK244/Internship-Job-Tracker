// src/components/Navbar.jsx
// Top navigation bar — shows user name and logout button

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [confirming, setConfirming] = useState(false)

  const handleLogout = () => {
    if (confirming) {
      logout()
    } else {
      setConfirming(true)
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setConfirming(false), 3000)
    }
  }

  // Get initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header style={styles.navbar}>
      <div style={styles.inner}>
        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.brandIcon}>⚡</span>
          <span style={styles.brandName}>TrackIt</span>
          <span style={styles.brandTag}>Job Tracker</span>
        </div>

        {/* Right side */}
        <div style={styles.right}>
          {/* User avatar + name */}
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{initials}</div>
            <div style={styles.userMeta}>
              <span style={styles.userName}>{user?.name || 'User'}</span>
              <span style={styles.userEmail}>{user?.email || ''}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              ...styles.logoutBtn,
              ...(confirming ? styles.logoutConfirm : {}),
            }}
            title={confirming ? 'Click again to confirm logout' : 'Logout'}
          >
            {confirming ? '⚠ Confirm?' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}

const styles = {
  navbar: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10, 15, 30, 0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto',
    padding: '0 24px', height: '64px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '8px' },
  brandIcon: { fontSize: '20px' },
  brandName: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: '20px', color: 'var(--accent)', letterSpacing: '-0.5px',
  },
  brandTag: {
    fontSize: '11px', color: 'var(--text-muted)',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '20px', padding: '2px 8px',
    fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase',
  },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'var(--accent-dim)', border: '2px solid var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-display)', fontWeight: 700,
    fontSize: '13px', color: 'var(--accent)', flexShrink: 0,
  },
  userMeta: {
    display: 'flex', flexDirection: 'column',
    // Hide on small screens via parent overflow
  },
  userName: { fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 },
  userEmail: { fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.2 },
  logoutBtn: {
    background: 'transparent', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '7px 14px',
    color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500,
    transition: 'var(--transition)', cursor: 'pointer',
  },
  logoutConfirm: {
    borderColor: '#ef4444', color: '#f87171',
    background: 'rgba(239,68,68,0.08)',
  },
}
