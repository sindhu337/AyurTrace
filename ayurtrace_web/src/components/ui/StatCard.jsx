import React from 'react'

export default function StatCard({ label, value, icon: Icon, color = 'ayur', sub }) {
  const colors = {
    ayur:   { bg: 'bg-ayur-50',   icon: 'text-ayur-700',   value: 'text-ayur-800' },
    herb:   { bg: 'bg-herb-50',   icon: 'text-herb-700',   value: 'text-herb-800' },
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-700',   value: 'text-blue-800' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-700',    value: 'text-red-800' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-700', value: 'text-purple-800' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-700', value: 'text-orange-800' },
    gray:   { bg: 'bg-gray-50',   icon: 'text-gray-600',   value: 'text-gray-800' },
  }
  const c = colors[color] || colors.ayur
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${c.value}`}>{value ?? '—'}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${c.icon}`} />
          </div>
        )}
      </div>
    </div>
  )
}
