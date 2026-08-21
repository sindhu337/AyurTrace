import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import StatCard from '../../components/ui/StatCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import {
  Users, Factory, Layers, Package, ShoppingCart,
  ClipboardList, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getDashboard()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading dashboard..." />

  const s = stats || {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Dashboard</h1>
        <span className="text-xs text-gray-400">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
      </div>

      {/* Farmers */}
      <h2 className="section-title">Farmers Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Farmers"    value={s.totalFarmers}    icon={Users}         color="ayur" />
        <StatCard label="Pending"          value={s.pendingFarmers}  icon={Clock}         color="herb" />
        <StatCard label="Active"           value={s.activeFarmers}   icon={CheckCircle}   color="ayur" />
        <StatCard label="Rejected/Blocked" value={s.rejectedFarmers} icon={XCircle}       color="red"  />
      </div>

      {/* Manufacturers */}
      <h2 className="section-title">Manufacturers Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Manufacturers"    value={s.totalManufacturers}    icon={Factory}       color="blue"   />
        <StatCard label="Pending Applications"   value={s.pendingManufacturers}  icon={ClipboardList} color="herb"   />
        <StatCard label="Approved"               value={s.approvedManufacturers} icon={CheckCircle}   color="ayur"   />
        <StatCard label="Rejected"               value={s.rejectedManufacturers} icon={XCircle}       color="red"    />
      </div>

      {/* Platform */}
      <h2 className="section-title">Platform Activity</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Batches"  value={s.totalBatches}  icon={Layers}       color="purple" />
        <StatCard label="Total Products" value={s.totalProducts} icon={Package}      color="orange" />
        <StatCard label="Total Orders"   value={s.totalOrders}   icon={ShoppingCart} color="blue"   />
      </div>

      {/* Quick Actions */}
      <h2 className="section-title">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/admin/farmer-applications',       icon: ClipboardList, label: 'Review Farmer Applications',       color: 'bg-herb-50 text-herb-700 hover:bg-herb-100',    badge: s.pendingFarmers },
          { to: '/admin/manufacturer-applications', icon: ClipboardList, label: 'Review Manufacturer Applications', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',    badge: s.pendingManufacturers },
          { to: '/admin/farmers',                   icon: Users,         label: 'Manage Farmers',                   color: 'bg-ayur-50 text-ayur-700 hover:bg-ayur-100',    badge: null },
          { to: '/admin/manufacturers',             icon: Factory,       label: 'Manage Manufacturers',             color: 'bg-purple-50 text-purple-700 hover:bg-purple-100', badge: null },
        ].map(({ to, icon: Icon, label, color, badge }) => (
          <Link key={to} to={to}
            className={`relative card flex items-center gap-3 p-4 transition-colors cursor-pointer ${color}`}>
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold">{label}</span>
            {badge > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Pending alerts */}
      {(s.pendingFarmers > 0 || s.pendingManufacturers > 0) && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {s.pendingFarmers > 0 && (
            <div className="flex items-center gap-3 bg-herb-50 border border-herb-200 rounded-lg px-4 py-3 text-sm text-herb-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span><strong>{s.pendingFarmers}</strong> farmer application{s.pendingFarmers > 1 ? 's' : ''} awaiting review.</span>
              <Link to="/admin/farmer-applications" className="ml-auto text-herb-700 font-semibold hover:underline whitespace-nowrap">Review →</Link>
            </div>
          )}
          {s.pendingManufacturers > 0 && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span><strong>{s.pendingManufacturers}</strong> manufacturer application{s.pendingManufacturers > 1 ? 's' : ''} awaiting review.</span>
              <Link to="/admin/manufacturer-applications" className="ml-auto text-blue-700 font-semibold hover:underline whitespace-nowrap">Review →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
