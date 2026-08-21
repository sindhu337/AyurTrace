import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { manufacturerAPI } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Building2, Edit2, Save, X } from 'lucide-react'

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh',
]

export default function ManufacturerProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})

  const load = () => {
    setLoading(true)
    manufacturerAPI.getProfile()
      .then(r => { setProfile(r.data); setForm(r.data) })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await manufacturerAPI.updateProfile(form)
      setProfile(r.data)
      setEditing(false)
      toast.success('Profile updated successfully.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading profile..." />
  if (!profile) return <p className="text-gray-500">Profile not found.</p>

  return (
    <div>
      <h1 className="page-title">Profile</h1>

      <div className="max-w-2xl">
        <div className="card">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-5 border-b">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-herb-100 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-herb-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{profile.companyName}</h2>
                <p className="text-sm text-gray-500">{profile.ownerName}</p>
                {profile.manufacturerId && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-ayur-100 text-ayur-800 mt-1">
                    {profile.manufacturerId}
                  </span>
                )}
              </div>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-outline flex items-center gap-2 text-sm py-2">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <button onClick={() => { setEditing(false); setForm(profile) }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Company Name *">
                  <input className="input-field" value={form.companyName || ''} onChange={set('companyName')} required />
                </Field>
                <Field label="Owner Name *">
                  <input className="input-field" value={form.ownerName || ''} onChange={set('ownerName')} required />
                </Field>
                <Field label="Mobile">
                  <input className="input-field" value={form.mobile || ''} onChange={set('mobile')} />
                </Field>
                <Field label="AYUSH License No.">
                  <input className="input-field" value={form.ayushLicenseNo || ''} onChange={set('ayushLicenseNo')} />
                </Field>
                <Field label="License Expiry">
                  <input className="input-field" type="date" value={form.licenseExpiry ? form.licenseExpiry.split('T')[0] : ''} onChange={set('licenseExpiry')} />
                </Field>
                <Field label="GST Number">
                  <input className="input-field" value={form.gstNumber || ''} onChange={set('gstNumber')} />
                </Field>
                <Field label="State">
                  <select className="input-field" value={form.state || ''} onChange={set('state')}>
                    <option value="">Select State</option>
                    {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="District">
                  <input className="input-field" value={form.district || ''} onChange={set('district')} />
                </Field>
                <Field label="Pincode">
                  <input className="input-field" value={form.pincode || ''} onChange={set('pincode')} maxLength={6} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Address">
                    <textarea className="input-field resize-none" rows={3} value={form.address || ''} onChange={set('address')} />
                  </Field>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setEditing(false); setForm(profile) }} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ['Manufacturer ID',   profile.manufacturerId || 'Pending'],
                ['Company Name',      profile.companyName],
                ['Owner Name',        profile.ownerName],
                ['Email',             profile.email],
                ['Mobile',            profile.mobile],
                ['AYUSH License No.', profile.ayushLicenseNo || '—'],
                ['License Expiry',    profile.licenseExpiry ? new Date(profile.licenseExpiry).toLocaleDateString('en-IN') : '—'],
                ['GST Number',        profile.gstNumber || '—'],
                ['District',          profile.district],
                ['State',             profile.state],
                ['Pincode',           profile.pincode],
                ['Status',            <span key="s" className={`badge-${(profile.status || '').toLowerCase()}`}>{profile.status}</span>],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{l}</p>
                  <p className="text-sm text-gray-700">{v || '—'}</p>
                </div>
              ))}
              {profile.address && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
                  <p className="text-sm text-gray-700">{profile.address}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  )
}
