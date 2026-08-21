import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Leaf, ArrowLeft, Upload, Eye, EyeOff } from 'lucide-react'
import { authAPI, fileAPI } from '../../services/api'

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh',
]

export default function ManufacturerRegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [licenseFile, setLicenseFile] = useState(null)
  const [form, setForm] = useState({
    companyName: '', ownerName: '', email: '', mobile: '',
    ayushLicenseNo: '', licenseExpiry: '', licenseDocument: '',
    gstNumber: '', address: '', state: '', district: '', pincode: '', password: '',
  })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setLicenseFile(file)
  }

  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      let licenseDocument = form.licenseDocument
      // Upload license document if selected
      if (licenseFile) {
        const res = await fileAPI.upload('licenses', licenseFile)
        licenseDocument = res.data?.data || ''
      }

      await authAPI.manufacturerRegister({ ...form, licenseDocument })
      toast.success('Registration submitted successfully!')
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center p-8 space-y-6">
          <div className="w-16 h-16 bg-herb-100 rounded-full flex items-center justify-center mx-auto text-herb-700">
            <Leaf className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-gray-800">Registration Successful!</h1>
            <p className="text-gray-500 text-sm">
              Your manufacturer registration has been submitted successfully.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Application Status:</span>
              <span className="font-semibold text-ayur-700">PENDING</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed pt-1">
              Your account will be available after administrator approval. You will receive your Manufacturer ID after approval.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link to="/manufacturer/login" className="btn-primary w-full text-center py-2.5">
              Manufacturer Login
            </Link>
            <Link to="/" className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors py-2">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-ayur-900 text-white px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-ayur-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">AYURTRACE</span>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-ayur-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="card">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-800">Manufacturer Registration</h1>
            <p className="text-gray-500 text-sm mt-1">
              Submit your application to join AYURTRACE as a verified manufacturer.
              Admin will review and approve your application.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            <div>
              <h2 className="section-title border-b pb-2">Company Information</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Company Name *</label>
                  <input className="input-field" value={form.companyName} onChange={set('companyName')} required placeholder="e.g. Ayur Herbs Pvt. Ltd." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Owner Name *</label>
                  <input className="input-field" value={form.ownerName} onChange={set('ownerName')} required placeholder="Full name of owner" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                  <input className="input-field" type="email" value={form.email} onChange={set('email')} required placeholder="company@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number *</label>
                  <input className="input-field" type="tel" value={form.mobile} onChange={set('mobile')} required placeholder="10-digit mobile" maxLength={10} />
                </div>
              </div>
            </div>

            {/* License & GST */}
            <div>
              <h2 className="section-title border-b pb-2">License & Registration</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">AYUSH License No. *</label>
                  <input className="input-field" value={form.ayushLicenseNo} onChange={set('ayushLicenseNo')} required placeholder="AYUSH/XXXXX/YYYY" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">License Expiry Date</label>
                  <input className="input-field" type="date" value={form.licenseExpiry} onChange={set('licenseExpiry')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">GST Number *</label>
                  <input className="input-field" value={form.gstNumber} onChange={set('gstNumber')} required placeholder="22AAAAA0000A1Z5" maxLength={15} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">License Document (PDF/Image)</label>
                  <label className="flex items-center gap-2 input-field cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 text-sm truncate">
                      {licenseFile ? licenseFile.name : 'Click to upload license'}
                    </span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="section-title border-b pb-2">Address</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Address *</label>
                  <textarea className="input-field resize-none" rows={3} value={form.address} onChange={set('address')} required placeholder="Street, Building, Area..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                  <select className="input-field" value={form.state} onChange={set('state')} required>
                    <option value="">Select State</option>
                    {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">District *</label>
                  <input className="input-field" value={form.district} onChange={set('district')} required placeholder="District name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode *</label>
                  <input className="input-field" value={form.pincode} onChange={set('pincode')} required placeholder="6-digit pincode" maxLength={6} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h2 className="section-title border-b pb-2">Account Security</h2>
              <div className="mt-4 max-w-sm">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
                <div className="relative">
                  <input
                    className="input-field pr-10"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  You will use this password to login after admin approval.
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="bg-herb-50 border border-herb-200 rounded-lg p-4 text-sm text-herb-800">
              <strong>Note:</strong> Your application will be reviewed by the AYURTRACE admin.
              After approval, you will receive a Manufacturer ID (e.g. <strong>AYM000001</strong>) to log in.
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">
                Already registered?{' '}
                <Link to="/manufacturer/login" className="text-ayur-700 font-semibold hover:underline">Login here</Link>
              </p>
              <button type="submit" disabled={loading} className="btn-primary px-8">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
