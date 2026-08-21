import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { adminAPI } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import {
  Factory, Eye, CheckCircle, XCircle,
  MapPin, Phone, Mail, FileText, Building2, Hash
} from 'lucide-react'

export default function AdminManufacturerApplications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewItem, setViewItem] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    adminAPI.getPendingManufacturers()
      .then(r => setItems(r.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleAction = async () => {
    if (!confirm) return
    try {
      if (confirm.action === 'approve') {
        const r = await adminAPI.approveManufacturer(confirm.id)
        toast.success(`Manufacturer approved! ID: ${r.data.manufacturerId}`)
      } else {
        await adminAPI.rejectManufacturer(confirm.id)
        toast.success('Manufacturer application rejected.')
      }
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setConfirm(null)
    }
  }

  if (loading) return <LoadingSpinner text="Loading manufacturer applications..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Manufacturer Applications</h1>
        <span className="badge-pending">{items.length} Pending</span>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Factory} title="No pending manufacturer applications"
          subtitle="All manufacturer applications have been reviewed." />
      ) : (
        <div className="table-container">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                {['#', 'Company', 'Owner', 'Email', 'Mobile', 'AYUSH License', 'State', 'Reg. Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {items.map((m, i) => (
                <tr key={m.id} className="table-row">
                  <td className="table-td text-gray-400">{i + 1}</td>
                  <td className="table-td font-medium text-gray-800">{m.companyName}</td>
                  <td className="table-td">{m.ownerName}</td>
                  <td className="table-td">{m.email}</td>
                  <td className="table-td">{m.mobile}</td>
                  <td className="table-td font-mono text-xs">{m.ayushLicenseNo}</td>
                  <td className="table-td">{m.state}</td>
                  <td className="table-td text-gray-400 text-xs">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="table-td"><StatusBadge status={m.status} /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewItem(m)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirm({ id: m.id, action: 'approve' })} className="p-1.5 text-gray-500 hover:text-ayur-700 hover:bg-ayur-50 rounded-lg transition-colors" title="Approve">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirm({ id: m.id, action: 'reject' })} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
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
      <Modal open={!!viewItem} title="Manufacturer Application Details" onClose={() => setViewItem(null)} size="xl">
        {viewItem && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <D label="Company Name"      value={viewItem.companyName}    icon={<Building2 className="w-4 h-4 text-gray-400" />} />
              <D label="Owner Name"        value={viewItem.ownerName} />
              <D label="Email"             value={viewItem.email}          icon={<Mail className="w-4 h-4 text-gray-400" />} />
              <D label="Mobile"            value={viewItem.mobile}         icon={<Phone className="w-4 h-4 text-gray-400" />} />
              <D label="AYUSH License No." value={viewItem.ayushLicenseNo} icon={<FileText className="w-4 h-4 text-gray-400" />} />
              <D label="License Expiry"    value={viewItem.licenseExpiry ? new Date(viewItem.licenseExpiry).toLocaleDateString('en-IN') : '—'} />
              <D label="GST Number"        value={viewItem.gstNumber}      icon={<Hash className="w-4 h-4 text-gray-400" />} />
              <D label="Status"            value={<StatusBadge status={viewItem.status} />} />
              <D label="Address"           value={viewItem.address} />
              <D label="District"          value={viewItem.district}       icon={<MapPin className="w-4 h-4 text-gray-400" />} />
              <D label="State"             value={viewItem.state} />
              <D label="Pincode"           value={viewItem.pincode} />
              {viewItem.licenseDocument && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">License Document</p>
                  <a href={viewItem.licenseDocument} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-ayur-700 hover:underline flex items-center gap-1">
                    <FileText className="w-4 h-4" /> View Document
                  </a>
                </div>
              )}
            </div>
            {viewItem.status === 'PENDING' && (
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => { setViewItem(null); setConfirm({ id: viewItem.id, action: 'approve' }) }}
                  className="btn-success flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => { setViewItem(null); setConfirm({ id: viewItem.id, action: 'reject' }) }}
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
        title={confirm?.action === 'approve' ? 'Approve Manufacturer' : 'Reject Manufacturer'}
        message={confirm?.action === 'approve'
          ? 'Approve this manufacturer? A unique Manufacturer ID (AYM000001) will be generated and they can log in immediately.'
          : 'Reject this manufacturer application? This cannot be easily reversed.'}
        danger={confirm?.action === 'reject'}
        onConfirm={handleAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}

function D({ label, value, icon }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5 text-sm text-gray-700">
        {icon}<span>{value}</span>
      </div>
    </div>
  )
}
