import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { manufacturerAPI } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { ShoppingCart, Eye, Search } from 'lucide-react'

const ORDER_STATUSES = ['PLACED','CONFIRMED','PROCESSING','READY','SHIPPED','DELIVERED','CANCELLED']

export default function ManufacturerOrders() {
  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewOrder, setViewOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => {
    setLoading(true)
    manufacturerAPI.getOrders()
      .then(r => { setOrders(r.data); setFiltered(r.data) })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(orders.filter(o =>
      (!statusFilter || o.status === statusFilter) &&
      ((o.customerName || '').toLowerCase().includes(q) ||
       String(o.id).includes(q))
    ))
  }, [search, statusFilter, orders])

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId)
    try {
      await manufacturerAPI.updateOrderStatus(orderId, status)
      toast.success('Order status updated.')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <LoadingSpinner text="Loading orders..." />

  const totalAmount = filtered.reduce((s, o) => s + (o.totalAmount || 0), 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title mb-0">My Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} orders · Total: ₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select className="input-field text-sm w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input-field pl-9 text-sm w-48" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No orders found"
          subtitle="Customer orders for your products will appear here." />
      ) : (
        <div className="table-container">
          <table className="table-base">
            <thead className="table-head">
              <tr>{['Order ID', 'Customer', 'Mobile', 'Total', 'Payment', 'Order Date', 'Status', 'Update Status', 'Actions'].map(h =>
                <th key={h} className="table-th">{h}</th>)}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map(o => (
                <tr key={o.id} className="table-row">
                  <td className="table-td font-mono text-xs text-ayur-700">#{o.id}</td>
                  <td className="table-td font-medium text-gray-800">{o.customerName || '—'}</td>
                  <td className="table-td text-xs">{o.customerMobile || '—'}</td>
                  <td className="table-td font-semibold text-ayur-700">₹{o.totalAmount?.toFixed(2)}</td>
                  <td className="table-td text-xs">{o.paymentMethod} <span className="text-gray-400">({o.paymentStatus})</span></td>
                  <td className="table-td text-xs text-gray-500">
                    {o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="table-td"><StatusBadge status={o.status} /></td>
                  <td className="table-td">
                    <select
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ayur-500"
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={e => handleStatusUpdate(o.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="table-td">
                    <button onClick={() => setViewOrder(o)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!viewOrder} title={`Order #${viewOrder?.id}`} onClose={() => setViewOrder(null)} size="lg">
        {viewOrder && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['Customer', viewOrder.customerName],
                ['Mobile', viewOrder.customerMobile],
                ['Total', `₹${viewOrder.totalAmount?.toFixed(2)}`],
                ['Payment Method', viewOrder.paymentMethod],
                ['Payment Status', viewOrder.paymentStatus],
                ['Order Date', viewOrder.orderDate ? new Date(viewOrder.orderDate).toLocaleString('en-IN') : '—'],
                ['Status', <StatusBadge key="s" status={viewOrder.status} />],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{l}</p>
                  <p className="text-sm text-gray-700">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Order Items</h3>
              <div className="space-y-2">
                {(viewOrder.items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <span className="text-gray-800">{item.productName}</span>
                    <span className="text-gray-500">× {item.quantity}</span>
                    <span className="font-semibold text-ayur-700">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
