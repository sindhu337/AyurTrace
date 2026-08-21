import React from 'react'

const map = {
  PENDING:    'badge-pending',
  ACTIVE:     'badge-active',
  APPROVED:   'badge-approved',
  REJECTED:   'badge-rejected',
  BLOCKED:    'badge-blocked',
  CREATED:    'badge-pending',
  SUBMITTED:  'badge-pending',
  RECEIVED:   'badge-approved',
  PROCESSING: 'badge-approved',
  COMPLETED:  'badge-active',
  HARVESTED:  'badge-active',
  PLACED:     'badge-pending',
  CONFIRMED:  'badge-approved',
  SHIPPED:    'badge-approved',
  DELIVERED:  'badge-active',
  CANCELLED:  'badge-rejected',
  READY:      'badge-approved',
  OUT_OF_STOCK: 'badge-blocked',
  INACTIVE:   'badge-blocked',
}

export default function StatusBadge({ status }) {
  const cls = map[status] || 'badge-pending'
  return <span className={cls}>{status}</span>
}
