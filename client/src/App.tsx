// src/App.tsx
// Root component: sets up AuthProvider + all routes
// Protected routes redirect unauthenticated users to /login

import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.tsx'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import JobDetails from './pages/JobDetails'
import Navbar from './components/Navbar'
import type { ReactNode } from 'react'

// ── ProtectedRoute ────────────────────────────────────────────────────────────
// Wraps any route that requires authentication.
// Shows a loading spinner while verifying the stored token.
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', gap: '12px',
        fontFamily: 'var(--font-body)', color: 'var(--text-secondary)'
      }}>
        <div className="spinner" />
        <span>Verifying session…</span>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// ── PublicRoute ───────────────────────────────────────────────────────────────
// Redirects authenticated users away from login/register to dashboard
function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

// ── AppRoutes ─────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public routes */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main>
          <AppRoutes />
        </main>
      </div>
    </AuthProvider>
  )
}