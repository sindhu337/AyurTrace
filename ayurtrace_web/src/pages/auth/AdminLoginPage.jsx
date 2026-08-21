import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Leaf, Shield, Eye, EyeOff, ArrowLeft, Lock } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.adminLogin(form)
      const { token, username, role, id } = res.data
      login(token, { username, role, id })
      toast.success('Welcome, Administrator!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-ayur-900 to-gray-800 flex flex-col">
      {/* Nav */}
      <div className="px-6 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">AYURTRACE</span>
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-gray-700" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-ayur-700 rounded-full flex items-center justify-center">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <div className="text-center mb-7">
              <h1 className="text-2xl font-extrabold text-gray-800">Admin Login</h1>
              <p className="text-gray-500 text-sm mt-1">AYURTRACE Administration Panel</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Username</label>
                <input
                  className="input-field"
                  value={form.username}
                  onChange={set('username')}
                  required
                  placeholder="Admin username"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    className="input-field pr-10"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    required
                    placeholder="Admin password"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 bg-gray-800 hover:bg-gray-900">
                {loading ? 'Signing in...' : 'Sign In as Admin'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <Link to="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-3 h-3" /> Back to Home
              </Link>
            </div>

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
              Admin access is restricted. This portal is for AYURTRACE system administrators only.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
