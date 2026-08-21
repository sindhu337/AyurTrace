import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { manufacturerAPI } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { Layers, Eye, Search, RefreshCw } from 'lucide-react'

const BATCH_STATUSES = ['CREATED', 'SUBMITTED', 'RECEIVED', 'PROCESSING', 'COMPLETED']

export default function ManufacturerBatches() {
  const [batches, setBatches] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewBatch, setViewBatch] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => {
    setLoading(true)
    manufacturerAPI.getBatches()
      .then(r => { setBatches(r.data); setFiltered(r.data) })
      .catch(() => toast.error('Failed to load batches'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(batches.filter(b =>
      (!statusFilter || b.status === statusFilter) &&
      ((b.batchNumber || '').toLowerCase().includes(q) ||
       (b.herbName || '').toLowerCase().includes(q) ||
       (b.farmerName || '').toLowerCase().includes(q) ||
       (b.farmerId || '').toLowerCase().includes(q))
    ))
  }, [search, statusFilter, batches])

  const handleStatusChange = async (batchId, newStatus) => {
    setUpdatingId(batchId)
    try {
      await manufacturerAPI.updateBatchStatus(batchId, newStatus)
      toast.success('Batch status updated.')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <LoadingSpinner text="Loading batches..." />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="page-title mb-0">Batch Management</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <select className="input-field text-sm w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {BATCH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input-field pl-9 text-sm w-48" placeholder="Search batches..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Layers} title="No batches found"
          subtitle="Batches created by assigned farmers will appear here." />
      ) : (
        <div className="table-container">
          <table className="table-base">
            <thead className="table-head">
              <tr>{['Batch Number', 'Herb', 'Farmer ID', 'Farmer', 'Quantity', 'Harvest Date', 'Location', 'Status', 'Update Status', 'Actions'].map(h =>
                <th key={h} className="table-th">{h}</th>)}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map(b => (
                <tr key={b.id} className="table-row">
                  <td className="table-td font-mono text-xs text-ayur-700">{b.batchNumber}</td>
                  <td className="table-td font-medium text-gray-800">{b.herbName}</td>
                  <td className="table-td text-xs font-mono">{b.farmerId || '—'}</td>
                  <td className="table-td">{b.farmerName}</td>
                  <td className="table-td text-xs">{b.quantity} {b.quantityUnit}</td>
                  <td className="table-td text-xs text-gray-500">
                    {b.harvestDate ? new Date(b.harvestDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="table-td text-xs">{b.location || '—'}</td>
                  <td className="table-td"><StatusBadge status={b.status} /></td>
                  <td className="table-td">
                    <select
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ayur-500"
                      value={b.status}
                      disabled={updatingId === b.id}
                      onChange={e => handleStatusChange(b.id, e.target.value)}
                    >
                      {BATCH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="table-td">
                    <button onClick={() => setViewBatch(b)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!viewBatch} title="Batch Details" onClose={() => setViewBatch(null)} size="lg">
        {viewBatch && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['Batch Number',    viewBatch.batchNumber],
                ['Herb Name',       viewBatch.herbName],
                ['Farmer ID',       viewBatch.farmerId || '—'],
                ['Farmer Name',     viewBatch.farmerName],
                ['Farmer District', viewBatch.farmerDistrict],
                ['Farmer State',    viewBatch.farmerState],
                ['Quantity',        `${viewBatch.quantity} ${viewBatch.quantityUnit}`],
                ['Harvest Date',    viewBatch.harvestDate ? new Date(viewBatch.harvestDate).toLocaleDateString('en-IN') : '—'],
                ['Location',        viewBatch.location || '—'],
                ['GPS',             viewBatch.latitude ? `${viewBatch.latitude}, ${viewBatch.longitude}` : '—'],
                ['Status',          <StatusBadge key="s" status={viewBatch.status} />],
                ['QR Code',         viewBatch.qrCode || '—'],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{l}</p>
                  <p className="text-sm text-gray-700">{v}</p>
                </div>
              ))}
              {viewBatch.notes && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Notes</p>
                  <p className="text-sm text-gray-700">{viewBatch.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
