import React, { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'

const statusClass = {
  SUBMITTED: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  RECEIVED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
}

export default function AdminBatches() {
  const [batches, setBatches] = useState([])
  const [manufacturers, setManufacturers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [batchResponse, manufacturerResponse] = await Promise.all([
        adminAPI.getBatches(),
        adminAPI.getAllManufacturers(),
      ])
      setBatches(batchResponse.data || [])
      setManufacturers((manufacturerResponse.data || []).filter((m) => m.status === 'APPROVED'))
      setError('')
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load batches.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const action = async (id, operation) => {
    setBusy(id)
    try {
      await operation()
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'The batch action failed.')
    } finally {
      setBusy(null)
    }
  }

  const reject = (batch) => {
    const reason = window.prompt('Reason for rejection:')
    if (reason?.trim()) action(batch.id, () => adminAPI.rejectBatch(batch.id, reason.trim()))
  }

  const assign = (batch) => {
    const id = window.prompt('Enter the approved manufacturer ID:')
    if (id) action(batch.id, () => adminAPI.assignBatch(batch.id, id))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Batch Review</h1>
        <p className="text-gray-500 mt-1">Review farmer submissions and assign approved batches.</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>}
      {loading ? <div className="text-gray-500">Loading batches...</div> : batches.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">No batches have been submitted.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr><th className="px-5 py-3">Batch</th><th className="px-5 py-3">Herb</th><th className="px-5 py-3">Farmer</th><th className="px-5 py-3">Quantity</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y">
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-5 py-4 font-medium">{batch.batchNumber || batch.id}</td>
                  <td className="px-5 py-4">{batch.herbName || '—'}</td>
                  <td className="px-5 py-4">{batch.farmerName || batch.farmerId || '—'}</td>
                  <td className="px-5 py-4">{batch.quantity || '—'} {batch.unit || ''}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[batch.status] || 'bg-gray-100 text-gray-700'}`}>{batch.status}</span></td>
                  <td className="px-5 py-4 space-x-2">
                    {batch.status === 'SUBMITTED' && <>
                      <button disabled={busy === batch.id} onClick={() => action(batch.id, () => adminAPI.approveBatch(batch.id))} className="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-50">Approve</button>
                      <button disabled={busy === batch.id} onClick={() => reject(batch)} className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50">Reject</button>
                    </>}
                    {batch.status === 'APPROVED' && !batch.assignedManufacturerId && (
                      <button disabled={busy === batch.id || manufacturers.length === 0} onClick={() => assign(batch)} className="rounded bg-ayur-700 px-3 py-1 text-white disabled:opacity-50">Assign</button>
                    )}
                    {batch.assignedManufacturerName && <span className="text-gray-500">{batch.assignedManufacturerName}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
