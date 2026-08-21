import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Shield, User } from 'lucide-react'

export default function AdminProfile() {
  const { user } = useAuth()
  return (
    <div>
      <h1 className="page-title">Profile</h1>
      <div className="card max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
            <span className="badge-approved">Administrator</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600 py-2 border-b">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-500 w-28">Username</span>
            <span className="text-gray-800 font-semibold">{user?.username}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 py-2 border-b">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-500 w-28">Role</span>
            <span className="text-gray-800">System Administrator</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Admin credentials are managed by the system.</p>
      </div>
    </div>
  )
}
