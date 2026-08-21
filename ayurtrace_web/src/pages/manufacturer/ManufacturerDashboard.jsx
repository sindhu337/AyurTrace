import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { manufacturerAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/ui/StatCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import {
  Package, Layers, ShoppingCart, QrCode, Users,
  BarChart2, TrendingUp, Bell, ArrowRight
} from 'lucide-react'

export default function ManufacturerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      manufacturerAPI.getDashboard(),
      manufacturerAPI.getProfile(),
    ]).then(([sRes, pRes]) => {
      setStats(sRes.data)
      setProfile(pRes.data)
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading dashboard..." />

  const s = stats || {}
  const companyName = profile?.companyName || user?.username || 'Manufacturer'

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-ayur-800 to-ayur-700 rounded-2xl p-6 mb-7 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-ayur-200 text-sm">Welcome back</p>
            <h1 className="text-2xl font-extrabold mt-0.5">{companyName}</h1>
            <p className="text-ayur-300 text-xs mt-1">{profile?.manufacturerId}</p>
          </div>
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-ayur-200 text-xs">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
            <span className="badge-active mt-2">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <h2 className="section-title">Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products"    value={s.totalProducts}    icon={Package}      color="ayur"   />
        <StatCard label="Total Batches"     value={s.totalBatches}     icon={Layers}       color="herb"   />
        <StatCard label="Batches Received"  value={s.batchesReceived}  icon={TrendingUp}   color="blue"   />
        <StatCard label="QR Codes"          value={s.qrCodesGenerated} icon={QrCode}       color="purple" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Orders Received"  value={s.ordersReceived}   icon={ShoppingCart} color="orange" />
        <StatCard label="Pending Orders"   value={s.ordersPending}    icon={ShoppingCart} color="herb"   />
        <StatCard label="Products Sold"    value={s.productsSold}     icon={BarChart2}    color="ayur"   />
        <StatCard label="Assigned Farmers" value={s.assignedFarmers}  icon={Users}        color="gray"   />
      </div>

      {/* Quick Nav */}
      <h2 className="section-title">Quick Access</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { to: '/manufacturer/supervisor',   icon: Users,        label: 'Herbal Supervision',   sub: 'Manage farmers & send messages',  color: 'bg-ayur-50  text-ayur-700'   },
          { to: '/manufacturer/batches',      icon: Layers,       label: 'Batch Management',     sub: 'View & update batch status',      color: 'bg-herb-50  text-herb-700'   },
          { to: '/manufacturer/post-product', icon: Package,      label: 'Post New Product',     sub: 'Add products to the marketplace', color: 'bg-blue-50  text-blue-700'   },
          { to: '/manufacturer/orders',       icon: ShoppingCart, label: 'Customer Orders',      sub: 'Review & update order status',    color: 'bg-orange-50 text-orange-700' },
          { to: '/manufacturer/qr',           icon: QrCode,       label: 'QR Codes',             sub: 'Generate & manage QR codes',      color: 'bg-purple-50 text-purple-700' },
          { to: '/manufacturer/analytics',    icon: BarChart2,    label: 'Analytics',            sub: 'Sales & performance charts',      color: 'bg-pink-50  text-pink-700'   },
        ].map(({ to, icon: Icon, label, sub, color }) => (
          <Link key={to} to={to}
            className={`card flex items-center gap-4 p-4 hover:shadow-md transition-shadow cursor-pointer ${color} border-0`}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs opacity-70 truncate">{sub}</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
