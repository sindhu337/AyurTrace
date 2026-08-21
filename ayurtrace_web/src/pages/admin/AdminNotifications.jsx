import React from 'react'
import EmptyState from '../../components/ui/EmptyState'
import { Bell } from 'lucide-react'

export default function AdminNotifications() {
  return (
    <div>
      <h1 className="page-title">Notifications</h1>
      <EmptyState icon={Bell} title="No notifications" subtitle="System notifications will appear here." />
    </div>
  )
}
