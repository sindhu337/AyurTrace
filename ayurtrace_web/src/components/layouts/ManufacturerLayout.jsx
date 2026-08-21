import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, Package, PackagePlus, Layers,
  QrCode, GitBranch, ShoppingCart, BarChart2, Bell,
  UserCircle, LogOut, Menu, X, Leaf, ChevronRight, Building2
} from 'lucide-react'
import ConfirmDialog from '../ui/ConfirmDialog'

const navItems = [
  { to: '/manufacturer/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/manufacturer/supervisor',   icon: Users,           label: 'Herbal Supervisor' },
  { to: '/manufacturer/products',     icon: Package,         label: 'Products' },
  { to: '/manufacturer/post-product', icon: PackagePlus,     label: 'Post Product' },
  { to: '/manufacturer/batches',      icon: Layers,          label: 'Batch Management' },
  { to: '/manufacturer/qr',           icon: QrCode,          label: 'QR Codes' },
  { to: '/manufacturer/traceability', icon: GitBranch,       label: 'Traceability' },
  { to: '/manufacturer/orders',       icon: ShoppingCart,    label: 'Orders' },
  { to: '/manufacturer/analytics',    icon: BarChart2,       label: 'Analytics' },
  { to: '/manufacturer/notifications',icon: Bell,            label: 'Notifications' },
  { to: '/manufacturer/profile',      icon: UserCircle,      label: 'Profile' },
]

export default function ManufacturerLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-ayur-900 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-ayur-800">
          <div className="w-9 h-9 bg-herb-500 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">AYURTRACE</div>
            <div className="text-herb-300 text-xs">Manufacturer</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-ayur-800">
          <div className="flex items-center gap-3 px-4 py-2 text-ayur-200 text-sm mb-2">
            <Building2 className="w-4 h-4" />
            <span className="truncate">{user?.username || 'Manufacturer'}</span>
          </div>
          <button
            onClick={() => setShowLogout(true)}
            className="sidebar-link sidebar-link-inactive w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Leaf className="w-4 h-4 text-ayur-600" />
            <span className="font-semibold text-ayur-700">AYURTRACE</span>
            <ChevronRight className="w-4 h-4" />
            <span>Manufacturer</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <ConfirmDialog
        open={showLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
      />
    </div>
  )
}
