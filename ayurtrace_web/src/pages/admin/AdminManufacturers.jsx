import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { adminAPI } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { Factory, Eye, ShieldOff, ShieldCheck, Search } from 'lucide-react'

export default function AdminManufacturers() {
  const [items, setItems] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewItem, setViewItem] = useState(null)

  const load = () => {
    setLoading(true)
    adminAPI.getAllManufacturers()
      .then(r => { setItems(r.data); setFiltered(r.data) })
      .catch(() => toast.error('Failed to load manufacturers'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(items.filter(m =>
      (m.companyName || '').toLowerCase().includes(q) ||
      (m.ownerName || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.manufacturerId || '').toLowerCase().includes(q)
    ))
  }, [search, items])

  const handleToggle = async (loginId) => {
    try {
      await adminAPI.toggleManufacturerBlock(loginId)
      toast.success('Manufacturer status updated.')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  if (loading) return <LoadingSpinner text="Loading manufacturers..." />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="page-title mb-0">Manufacturers</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input-field pl-9 text-sm" placeholder="Search by company, owner, ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Factory} title="No manufacturers found" />
      ) : (
        <div className="table-container">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                {['Mfg. ID', 'Company', 'Owner', 'Email', 'Mobile', 'AYUSH License', 'State', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map(m => (
                <tr key={m.id} className="table-row">
                  <td className="table-td font-mono text-xs text-ayur-700">{m.manufacturerId || '—'}</td>
                  <td className="table-td font-medium text-gray-800">{m.companyName}</td>
                  <td className="table-td">{m.ownerName}</td>
                  <td className="table-td">{m.email}</td>
                  <td className="table-td">{m.mobile}</td>
                  <td className="table-td text-xs">{m.ayushLicenseNo}</td>
                  <td className="table-td">{m.state}</td>
                  <td className="table-td"><StatusBadge status={m.status} /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewItem(m)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {m.status === 'APPROVED' && m.loginId && (
                        <button onClick={() => handleToggle(m.loginId)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Block">
                          <ShieldOff className="w-4 h-4" />
                        </button>
                      )}
                      {m.status === 'BLOCKED' && m.loginId && (
                        <button onClick={() => handleToggle(m.loginId)} className="p-1.5 text-gray-500 hover:text-ayur-700 hover:bg-ayur-50 rounded-lg" title="Unblock">
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!viewItem} title="Manufacturer Details" onClose={() => setViewItem(null)} size="xl">
        {viewItem && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['Manufacturer ID', viewItem.manufacturerId || 'Not assigned'],
              ['Company Name', viewItem.companyName],
              ['Owner Name', viewItem.ownerName],
              ['Email', viewItem.email],
              ['Mobile', viewItem.mobile],
              ['AYUSH License', viewItem.ayushLicenseNo],
              ['License Expiry', viewItem.licenseExpiry ? new Date(viewItem.licenseExpiry).toLocaleDateString('en-IN') : '—'],
              ['GST Number', viewItem.gstNumber],
              ['Address', viewItem.address],
              ['District', viewItem.district],
              ['State', viewItem.state],
              ['Pincode', viewItem.pincode],
              ['Status', <StatusBadge key="s" status={viewItem.status} />],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{l}</p>
                <p className="text-sm text-gray-700">{v}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
