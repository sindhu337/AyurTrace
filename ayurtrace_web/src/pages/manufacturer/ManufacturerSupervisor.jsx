import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { manufacturerAPI } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { Users, Send, MessageSquare, MapPin, Search, UserPlus } from 'lucide-react'

export default function ManufacturerSupervisor() {
  const [tab, setTab] = useState('assigned') // 'assigned' | 'all' | 'messages'
  const [assignedFarmers, setAssignedFarmers] = useState([])
  const [allFarmers, setAllFarmers] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [msgModal, setMsgModal] = useState(false)
  const [msgForm, setMsgForm] = useState({ farmerId: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      manufacturerAPI.getAssignedFarmers(),
      manufacturerAPI.getAllFarmers(),
      manufacturerAPI.getMessages(),
    ]).then(([af, all, msgs]) => {
      setAssignedFarmers(af.data)
      setAllFarmers(all.data)
      setMessages(msgs.data)
    }).catch(() => toast.error('Failed to load supervisor data'))
      .finally(() => setLoading(false))
  }

  useEffect(loadData, [])

  const handleAssign = async (farmerId) => {
    try {
      await manufacturerAPI.assignFarmer(farmerId)
      toast.success('Farmer assigned successfully.')
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign farmer')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!msgForm.farmerId) { toast.error('Select a farmer'); return }
    setSending(true)
    try {
      await manufacturerAPI.sendMessage({
        farmerId: parseInt(msgForm.farmerId),
        subject: msgForm.subject,
        message: msgForm.message,
      })
      toast.success('Message sent to farmer!')
      setMsgModal(false)
      setMsgForm({ farmerId: '', subject: '', message: '' })
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading supervisor data..." />

  const q = search.toLowerCase()
  const filteredAssigned = assignedFarmers.filter(f =>
    (f.fullName || '').toLowerCase().includes(q) ||
    (f.farmerId || '').toLowerCase().includes(q) ||
    (f.district || '').toLowerCase().includes(q)
  )
  const filteredAll = allFarmers.filter(f =>
    (f.fullName || '').toLowerCase().includes(q) ||
    (f.farmerId || '').toLowerCase().includes(q) ||
    (f.district || '').toLowerCase().includes(q)
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="page-title mb-0">Herbal Cultivation Supervisor</h1>
        <button onClick={() => setMsgModal(true)}
          className="btn-primary flex items-center gap-2 text-sm py-2">
          <Send className="w-4 h-4" /> Send Message to Farmer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
        {[['assigned', `Assigned Farmers (${assignedFarmers.length})`], ['all', 'All Active Farmers'], ['messages', `Messages (${messages.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === id ? 'bg-white shadow text-ayur-800 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      {tab !== 'messages' && (
        <div className="relative w-full sm:w-72 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input-field pl-9 text-sm" placeholder="Search farmers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {/* Assigned Farmers */}
      {tab === 'assigned' && (
        filteredAssigned.length === 0
          ? <EmptyState icon={Users} title="No assigned farmers" subtitle="Assign farmers from the 'All Active Farmers' tab." />
          : (
            <div className="table-container">
              <table className="table-base">
                <thead className="table-head">
                  <tr>{['Farmer ID', 'Name', 'Mobile', 'District', 'State', 'Status', 'Action'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAssigned.map(f => (
                    <tr key={f.id} className="table-row">
                      <td className="table-td font-mono text-xs text-ayur-700">{f.farmerId}</td>
                      <td className="table-td font-medium text-gray-800">{f.fullName}</td>
                      <td className="table-td">{f.mobile}</td>
                      <td className="table-td">{f.district}</td>
                      <td className="table-td">{f.state}</td>
                      <td className="table-td"><StatusBadge status={f.status} /></td>
                      <td className="table-td">
                        <button onClick={() => { setMsgForm(fm => ({ ...fm, farmerId: f.id })); setMsgModal(true) }}
                          className="text-xs btn-outline py-1 px-3 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
      )}

      {/* All Active Farmers */}
      {tab === 'all' && (
        filteredAll.length === 0
          ? <EmptyState icon={Users} title="No active farmers found" />
          : (
            <div className="table-container">
              <table className="table-base">
                <thead className="table-head">
                  <tr>{['Farmer ID', 'Name', 'Mobile', 'District', 'State', 'GPS', 'Assign'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAll.map(f => {
                    const isAssigned = assignedFarmers.some(a => a.id === f.id)
                    return (
                      <tr key={f.id} className="table-row">
                        <td className="table-td font-mono text-xs text-ayur-700">{f.farmerId}</td>
                        <td className="table-td font-medium text-gray-800">{f.fullName}</td>
                        <td className="table-td">{f.mobile}</td>
                        <td className="table-td">{f.district}</td>
                        <td className="table-td">{f.state}</td>
                        <td className="table-td text-xs text-gray-400">
                          {f.latitude ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{f.latitude}, {f.longitude}</span> : '—'}
                        </td>
                        <td className="table-td">
                          {isAssigned
                            ? <span className="badge-active">Assigned</span>
                            : <button onClick={() => handleAssign(f.id)} className="text-xs btn-outline py-1 px-3 flex items-center gap-1">
                                <UserPlus className="w-3 h-3" /> Assign
                              </button>
                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
      )}

      {/* Messages */}
      {tab === 'messages' && (
        messages.length === 0
          ? <EmptyState icon={MessageSquare} title="No messages sent yet" subtitle="Use the 'Send Message' button to contact farmers." />
          : (
            <div className="space-y-3">
              {messages.map(m => (
                <div key={m.id} className="card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800">{m.subject}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          m.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          m.status === 'REPLIED' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{m.status}</span>
                      </div>
                      <p className="text-sm text-gray-600">{m.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>To: <strong className="text-gray-600">{m.farmerName}</strong> ({m.farmerFarmerId})</span>
                        <span>{m.createdAt ? new Date(m.createdAt).toLocaleString('en-IN') : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
      )}

      {/* Send Message Modal */}
      <Modal open={msgModal} title="Send Message to Farmer" onClose={() => setMsgModal(false)} size="md">
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Select Farmer *</label>
            <select className="input-field" value={msgForm.farmerId} onChange={e => setMsgForm(f => ({ ...f, farmerId: e.target.value }))} required>
              <option value="">— Select a farmer —</option>
              {assignedFarmers.map(f => (
                <option key={f.id} value={f.id}>{f.fullName} ({f.farmerId})</option>
              ))}
            </select>
            {assignedFarmers.length === 0 && (
              <p className="text-xs text-red-500 mt-1">No assigned farmers. Assign farmers first from the 'All Active Farmers' tab.</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Subject *</label>
            <input className="input-field" value={msgForm.subject} onChange={e => setMsgForm(f => ({ ...f, subject: e.target.value }))}
              required placeholder="e.g. Cultivation Quantity Update" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Message *</label>
            <textarea className="input-field resize-none" rows={5} value={msgForm.message}
              onChange={e => setMsgForm(f => ({ ...f, message: e.target.value }))}
              required placeholder="Write your message to the farmer..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setMsgModal(false)}>Cancel</button>
            <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
