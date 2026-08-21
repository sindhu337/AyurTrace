import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, token, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ayur-700" />
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/" replace />
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'ROLE_MANUFACTURER') return <Navigate to="/manufacturer/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return children
}
