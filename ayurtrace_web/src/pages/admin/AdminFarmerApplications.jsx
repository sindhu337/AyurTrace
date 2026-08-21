import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { adminAPI } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { ClipboardList, Eye, CheckCircle, XCircle, MapPin, Phone, Mail, FileText } from 'lucide-react'

export default function AdminFarmerApplications() {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewFarmer, setViewFarmer] = useState(null)
  const [confirm, setConfirm] = useState(null) // { id, action: 'approve'|'reject' }
  const [actionLoading, setActionLoading] = useState(false)

  const load = () => {
    setLoading(true)
    adminAPI.getPendingFarmers()
      .then(r => setFarmers(r.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleAction = async () => {
    if (!confirm) return
    setActionLoading(true)
    try {
      if (confirm.action === 'approve') {
        const r = await adminAPI.approveFarmer(confirm.id)
        toast.success(`Farmer approved! ID: ${r.data.farmerId}`)
      } else {
        await adminAPI.rejectFarmer(confirm.id)
        toast.success('Farmer application rejected.')
      }
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setActionLoading(false)
      setConfirm(null)
    }
  }

  if (loading) return <LoadingSpinner text="Loading farmer applications..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Farmer Applications</h1>
        <span className="badge-pending">{farmers.length} Pending</span>
      </div>

      {farmers.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No pending farmer applications"
          subtitle="All farmer applications have been reviewed."
        />
      ) : (
        <div className="table-container">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                {['#', 'Name', 'Email', 'Mobile', 'District', 'State', 'Reg. Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {farmers.map((f, i) => (
                <tr key={f.id} className="table-row">
                  <td className="table-td text-gray-400">{i + 1}</td>
                  <td className="table-td font-medium text-gray-800">{f.fullName}</td>
                  <td className="table-td">{f.email}</td>
                  <td className="table-td">{f.mobile}</td>
                  <td className="table-td">{f.district}</td>
                  <td className="table-td">{f.state}</td>
                  <td className="table-td text-gray-400 text-xs">
                    {f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="table-td"><StatusBadge status={f.status} /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewFarmer(f)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirm({ id: f.id, action: 'approve' })}
                        className="p-1.5 text-gray-500 hover:text-ayur-700 hover:bg-ayur-50 rounded-lg transition-colors" title="Approve">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirm({ id: f.id, action: 'reject' })}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      <Modal open={!!viewFarmer} title="Farmer Application Details" onClose={() => setViewFarmer(null)} size="lg">
        {viewFarmer && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Detail label="Full Name"     value={viewFarmer.fullName} />
              <Detail label="Status"        value={<StatusBadge status={viewFarmer.status} />} />
              <Detail label="Email"         value={viewFarmer.email}    icon={<Mail className="w-4 h-4 text-gray-400" />} />
              <Detail label="Mobile"        value={viewFarmer.mobile}   icon={<Phone className="w-4 h-4 text-gray-400" />} />
              <Detail label="Aadhaar No."   value={viewFarmer.aadharNo || '—'} />
              <Detail label="Address"       value={viewFarmer.address}  />
              <Detail label="District"      value={viewFarmer.district} icon={<MapPin className="w-4 h-4 text-gray-400" />} />
              <Detail label="State"         value={viewFarmer.state}    />
              <Detail label="Pincode"       value={viewFarmer.pincode}  />
              <Detail label="GPS"           value={viewFarmer.latitude ? `${viewFarmer.latitude}, ${viewFarmer.longitude}` : '—'}
                icon={<MapPin className="w-4 h-4 text-gray-400" />} />
              <Detail label="RTC Document"  value={viewFarmer.rtcDocument || '—'}
                icon={<FileText className="w-4 h-4 text-gray-400" />} />
            </div>
            {viewFarmer.status === 'PENDING' && (
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => { setViewFarmer(null); setConfirm({ id: viewFarmer.id, action: 'approve' }) }}
                  className="btn-success flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => { setViewFarmer(null); setConfirm({ id: viewFarmer.id, action: 'reject' }) }}
                  className="btn-danger text-sm py-2 px-4 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.action === 'approve' ? 'Approve Farmer' : 'Reject Farmer'}
        message={confirm?.action === 'approve'
          ? 'Approve this farmer application? A unique Farmer ID will be generated.'
          : 'Reject this farmer application? This action cannot be undone easily.'}
        danger={confirm?.action === 'reject'}
        onConfirm={handleAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}

function Detail({ label, value, icon }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5 text-sm text-gray-700">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  )
}
