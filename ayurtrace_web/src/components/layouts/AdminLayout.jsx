import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, Factory, ClipboardList, Bell,
  UserCircle, LogOut, Menu, X, Leaf, ChevronRight, UserCheck
} from 'lucide-react'
import ConfirmDialog from '../ui/ConfirmDialog'

const navItems = [
  { to: '/admin/dashboard',                icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/farmer-applications',      icon: ClipboardList,   label: 'Farmer Applications' },
  { to: '/admin/manufacturer-applications',icon: ClipboardList,   label: 'Manufacturer Applications' },
  { to: '/admin/farmers',                  icon: Users,           label: 'Farmers' },
  { to: '/admin/manufacturers',            icon: Factory,         label: 'Manufacturers' },
  { to: '/admin/notifications',            icon: Bell,            label: 'Notifications' },
  { to: '/admin/profile',                  icon: UserCircle,      label: 'Profile' },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="admin-shell flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-ayur-900 flex flex-col transition-transform duration-300 admin-sidebar
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-ayur-800 admin-brand">
          <div className="w-9 h-9 bg-ayur-500 rounded-lg flex items-center justify-center admin-brand-mark">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">AYURTRACE</div>
            <div className="text-ayur-300 text-xs">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
            <UserCheck className="w-4 h-4" />
            <span className="truncate">{user?.username || 'Admin'}</span>
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
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0 admin-topbar">
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
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-700">Dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm text-gray-500">
            <span className="hidden sm:inline">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <button className="relative rounded-full p-2 hover:bg-gray-100" aria-label="Notifications">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ayur-600 font-semibold text-white">
              {(user?.username || 'A').charAt(0).toUpperCase()}
            </span>
            <span className="hidden font-semibold text-ayur-900 sm:inline">Hi, Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto admin-main">
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
