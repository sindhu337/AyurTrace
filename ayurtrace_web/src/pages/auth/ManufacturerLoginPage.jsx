import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Leaf, Building2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function ManufacturerLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ manufacturerId: '', password: '' })

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.manufacturerLogin(form)
      const { token, username, role, id } = res.data
      login(token, { username, role, id })
      toast.success(`Welcome back, ${username}!`)
      navigate('/manufacturer/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayur-900 via-ayur-800 to-ayur-700 flex flex-col">
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
              <div className="w-16 h-16 bg-herb-100 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-herb-700" />
              </div>
            </div>

            <div className="text-center mb-7">
              <h1 className="text-2xl font-extrabold text-gray-800">Manufacturer Login</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in with your approved Manufacturer ID</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Manufacturer ID</label>
                <input
                  className="input-field"
                  value={form.manufacturerId}
                  onChange={set('manufacturerId')}
                  required
                  placeholder="AYM000001"
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/manufacturer/register" className="text-ayur-700 font-semibold hover:underline">
                  Register here
                </Link>
              </div>
              <div className="text-center">
                <Link to="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                  <ArrowLeft className="w-3 h-3" /> Back to Home
                </Link>
              </div>
            </div>

            <div className="mt-5 p-3 bg-herb-50 border border-herb-100 rounded-lg text-xs text-herb-700">
              <strong>Note:</strong> Only admin-approved manufacturers can log in. Your Manufacturer ID
              (e.g. <strong>AYM000001</strong>) is assigned after application approval.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
