import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import {
  Users, Factory, Layers, Package, ShoppingCart,
  ClipboardList, Clock, CheckCircle, XCircle, ArrowRight,
  Sprout, Zap
} from 'lucide-react'

const cardStyles = {
  ayur: { icon: 'admin-stat-icon-green', value: 'text-emerald-900', arrow: 'bg-emerald-50 text-emerald-700' },
  herb: { icon: 'admin-stat-icon-yellow', value: 'text-amber-800', arrow: 'bg-amber-50 text-amber-700' },
  blue: { icon: 'admin-stat-icon-blue', value: 'text-blue-900', arrow: 'bg-blue-50 text-blue-700' },
  red: { icon: 'admin-stat-icon-red', value: 'text-red-800', arrow: 'bg-red-50 text-red-600' },
  purple: { icon: 'admin-stat-icon-purple', value: 'text-purple-900', arrow: 'bg-purple-50 text-purple-700' },
  orange: { icon: 'admin-stat-icon-orange', value: 'text-orange-900', arrow: 'bg-orange-50 text-orange-700' },
}

function DashboardStat({ label, value, icon: Icon, color }) {
  const style = cardStyles[color] || cardStyles.ayur
  return (
    <div className="admin-stat-card">
      <div className={`admin-stat-icon ${style.icon}`}><Icon className="h-6 w-6" /></div>
      <div className="min-w-0">
        <p className="admin-stat-label">{label}</p>
        <p className={`admin-stat-value ${style.value}`}>{value ?? 0}</p>
      </div>
      <span className={`admin-stat-arrow ${style.arrow}`}><ArrowRight className="h-4 w-4" /></span>
    </div>
  )
}

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
    <div className="admin-dashboard">
      <section className="admin-hero">
        <div className="relative z-10">
          <h1 className="admin-hero-title">Dashboard</h1>
          <p className="admin-hero-copy">Monitor herb traceability, farmer registrations, manufacturing activity,<br className="hidden sm:block" /> and platform operations.</p>
        </div>
        <div className="admin-hero-art" aria-hidden="true">
          <LeafArt className="h-28 w-28 -rotate-12 text-emerald-700/60" />
          <LeafArt className="h-20 w-20 rotate-45 text-emerald-800/50" />
          <LeafArt className="h-36 w-36 rotate-12 text-emerald-900/40" />
        </div>
      </section>

      <div className="admin-dashboard-body">
        <section className="admin-section">
          <h2 className="admin-section-title"><Sprout className="h-6 w-6" /> Farmers Overview</h2>
          <div className="admin-stat-grid four">
            <DashboardStat label="Total Farmers" value={s.totalFarmers} icon={Users} color="ayur" />
            <DashboardStat label="Pending" value={s.pendingFarmers} icon={Clock} color="herb" />
            <DashboardStat label="Active" value={s.activeFarmers} icon={CheckCircle} color="ayur" />
            <DashboardStat label="Rejected/Blocked" value={s.rejectedFarmers} icon={XCircle} color="red" />
          </div>
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title"><Factory className="h-6 w-6" /> Manufacturers Overview</h2>
          <div className="admin-stat-grid four">
            <DashboardStat label="Total Manufacturers" value={s.totalManufacturers} icon={Factory} color="blue" />
            <DashboardStat label="Pending Applications" value={s.pendingManufacturers} icon={ClipboardList} color="herb" />
            <DashboardStat label="Approved" value={s.approvedManufacturers} icon={CheckCircle} color="ayur" />
            <DashboardStat label="Rejected" value={s.rejectedManufacturers} icon={XCircle} color="red" />
          </div>
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title"><Layers className="h-6 w-6" /> Platform Activity</h2>
          <div className="admin-stat-grid three">
            <DashboardStat label="Total Batches" value={s.totalBatches} icon={Layers} color="purple" />
            <DashboardStat label="Total Products" value={s.totalProducts} icon={Package} color="orange" />
            <DashboardStat label="Total Orders" value={s.totalOrders} icon={ShoppingCart} color="blue" />
          </div>
        </section>

        <section className="admin-section admin-actions-section">
          <h2 className="admin-section-title"><Zap className="h-6 w-6" /> Quick Actions</h2>
          <div className="admin-action-grid">
            {[
              { to: '/admin/farmer-applications', icon: ClipboardList, label: 'Review Farmer Applications', color: 'yellow', badge: s.pendingFarmers },
              { to: '/admin/manufacturer-applications', icon: ClipboardList, label: 'Review Manufacturer Applications', color: 'blue', badge: s.pendingManufacturers },
              { to: '/admin/farmers', icon: Users, label: 'Manage Farmers', color: 'green' },
              { to: '/admin/manufacturers', icon: Factory, label: 'Manage Manufacturers', color: 'purple' },
            ].map(({ to, icon: Icon, label, color, badge }) => (
              <Link key={to} to={to} className={`admin-action-card ${color}`}>
                <span className="admin-action-icon"><Icon className="h-6 w-6" /></span>
                <span className="admin-action-label">{label}</span>
                {badge > 0 && <span className="admin-action-badge">{badge > 99 ? '99+' : badge}</span>}
                <ArrowRight className="admin-action-arrow h-5 w-5" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function LeafArt({ className }) {
  return <Sprout className={className} strokeWidth={1.2} />
}
