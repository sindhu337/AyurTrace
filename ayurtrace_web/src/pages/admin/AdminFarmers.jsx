import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { adminAPI } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { Users, Eye, ShieldOff, ShieldCheck, Search } from 'lucide-react'

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewFarmer, setViewFarmer] = useState(null)

  const load = () => {
    setLoading(true)
    adminAPI.getAllFarmers()
      .then(r => { setFarmers(r.data); setFiltered(r.data) })
      .catch(() => toast.error('Failed to load farmers'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(farmers.filter(f =>
      (f.fullName || '').toLowerCase().includes(q) ||
      (f.email || '').toLowerCase().includes(q) ||
      (f.farmerId || '').toLowerCase().includes(q) ||
      (f.district || '').toLowerCase().includes(q)
    ))
  }, [search, farmers])

  const handleToggleBlock = async (id) => {
    try {
      await adminAPI.toggleFarmerBlock(id)
      toast.success('Farmer status updated.')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  if (loading) return <LoadingSpinner text="Loading farmers..." />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="page-title mb-0">Farmers</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input-field pl-9 text-sm" placeholder="Search by name, email, ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No farmers found" />
      ) : (
        <div className="table-container">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                {['Farmer ID', 'Name', 'Email', 'Mobile', 'District', 'State', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map(f => (
                <tr key={f.id} className="table-row">
                  <td className="table-td font-mono text-xs text-ayur-700">{f.farmerId || '—'}</td>
                  <td className="table-td font-medium text-gray-800">{f.fullName}</td>
                  <td className="table-td">{f.email}</td>
                  <td className="table-td">{f.mobile}</td>
                  <td className="table-td">{f.district}</td>
                  <td className="table-td">{f.state}</td>
                  <td className="table-td"><StatusBadge status={f.status} /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewFarmer(f)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {f.status === 'ACTIVE' && (
                        <button onClick={() => handleToggleBlock(f.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Block">
                          <ShieldOff className="w-4 h-4" />
                        </button>
                      )}
                      {f.status === 'BLOCKED' && (
                        <button onClick={() => handleToggleBlock(f.id)} className="p-1.5 text-gray-500 hover:text-ayur-700 hover:bg-ayur-50 rounded-lg transition-colors" title="Unblock">
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

      <Modal open={!!viewFarmer} title="Farmer Details" onClose={() => setViewFarmer(null)} size="lg">
        {viewFarmer && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['Farmer ID', viewFarmer.farmerId || 'Not assigned yet'],
              ['Full Name', viewFarmer.fullName],
              ['Email', viewFarmer.email],
              ['Mobile', viewFarmer.mobile],
              ['Aadhaar', viewFarmer.aadharNo || '—'],
              ['Address', viewFarmer.address],
              ['District', viewFarmer.district],
              ['State', viewFarmer.state],
              ['Pincode', viewFarmer.pincode],
              ['GPS', viewFarmer.latitude ? `${viewFarmer.latitude}, ${viewFarmer.longitude}` : '—'],
              ['Status', <StatusBadge key="s" status={viewFarmer.status} />],
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
