import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { manufacturerAPI } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { Bell, BellOff, CheckCheck } from 'lucide-react'

export default function ManufacturerNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    manufacturerAPI.getNotifications()
      .then(r => setNotifications(r.data))
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const markRead = async (id) => {
    try {
      await manufacturerAPI.markNotifRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) return <LoadingSpinner text="Loading notifications..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title mb-0">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-ayur-600 mt-0.5">{unreadCount} unread</p>}
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={BellOff} title="No notifications" subtitle="You'll see notifications here for orders, batches, and supervisor messages." />
      ) : (
        <div className="space-y-3 max-w-2xl">
          {notifications.map(n => (
            <div key={n.id}
              className={`card p-4 border-l-4 transition-colors ${n.read ? 'border-l-gray-200 bg-white' : 'border-l-ayur-600 bg-ayur-50'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${n.read ? 'bg-gray-100' : 'bg-ayur-100'}`}>
                    <Bell className={`w-4 h-4 ${n.read ? 'text-gray-400' : 'text-ayur-700'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {n.timestamp ? new Date(n.timestamp).toLocaleString('en-IN') : ''}
                    </p>
                  </div>
                </div>
                {!n.read && (
                  <button onClick={() => markRead(n.id)}
                    className="text-xs text-ayur-700 hover:text-ayur-900 flex items-center gap-1 shrink-0 font-medium">
                    <CheckCheck className="w-3.5 h-3.5" /> Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
