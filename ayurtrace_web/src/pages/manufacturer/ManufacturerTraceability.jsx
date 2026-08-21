import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { manufacturerAPI } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import {
  GitBranch, Search, TreePine, Layers, Factory,
  Package, QrCode, MapPin, Calendar, ChevronRight
} from 'lucide-react'

export default function ManufacturerTraceability() {
  const [qrId, setQrId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!qrId.trim()) return
    setLoading(true)
    try {
      const r = await manufacturerAPI.getTraceability(qrId.trim())
      setData(r.data)
    } catch {
      toast.error('No traceability data found for this QR ID.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Traceability</h1>

      <div className="card mb-6 max-w-xl">
        <p className="text-sm text-gray-500 mb-4">
          Enter a QR code ID (e.g. <span className="font-mono font-medium">AYR-QR-000001</span>) to view
          the complete herb traceability chain.
        </p>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input-field pl-9" value={qrId} onChange={e => setQrId(e.target.value)}
              placeholder="AYR-QR-000001" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Trace'}
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner text="Fetching traceability data..." />}

      {data && !loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-ayur-700 font-semibold mb-2">
            <GitBranch className="w-5 h-5" />
            Traceability Chain for <span className="font-mono">{data.qrId}</span>
          </div>

          {/* Chain */}
          <div className="space-y-3">
            {/* Farmer */}
            <TraceStep icon={TreePine} color="bg-ayur-100 text-ayur-800" title="Farmer">
              <Row label="Farmer ID"  value={data.farmerId} />
              <Row label="Name"       value={data.farmerName} />
              <Row label="Location"   value={data.farmerDistrict ? `${data.farmerDistrict}, ${data.farmerState}` : '—'} />
              {data.farmerLatitude && <Row label="GPS" value={`${data.farmerLatitude}, ${data.farmerLongitude}`} icon={<MapPin className="w-3 h-3" />} />}
            </TraceStep>

            <ChevronDown />

            {/* Cultivation */}
            <TraceStep icon={TreePine} color="bg-herb-100 text-herb-800" title="Cultivation">
              <Row label="Herb"         value={data.herbName} />
              <Row label="Method"       value={data.cultivationMethod || '—'} />
              <Row label="Location"     value={data.cultivationLocation || '—'} />
              <Row label="Planted"      value={data.plantingDate ? new Date(data.plantingDate).toLocaleDateString('en-IN') : '—'} icon={<Calendar className="w-3 h-3" />} />
              <Row label="Expected Harvest" value={data.expectedHarvestDate ? new Date(data.expectedHarvestDate).toLocaleDateString('en-IN') : '—'} />
            </TraceStep>

            <ChevronDown />

            {/* Batch */}
            <TraceStep icon={Layers} color="bg-blue-100 text-blue-800" title="Batch">
              <Row label="Batch No."  value={data.batchNumber} />
              <Row label="Quantity"   value={data.batchQuantity ? `${data.batchQuantity} ${data.batchQuantityUnit}` : '—'} />
              <Row label="Harvest Date" value={data.harvestDate ? new Date(data.harvestDate).toLocaleDateString('en-IN') : '—'} />
              <Row label="Location"   value={data.batchLocation || '—'} />
            </TraceStep>

            <ChevronDown />

            {/* Manufacturer */}
            <TraceStep icon={Factory} color="bg-purple-100 text-purple-800" title="Manufacturer">
              <Row label="Mfg. ID"    value={data.manufacturerIdCode} />
              <Row label="Company"    value={data.manufacturerCompanyName} />
              <Row label="Owner"      value={data.manufacturerOwnerName} />
              <Row label="Location"   value={data.manufacturerDistrict ? `${data.manufacturerDistrict}, ${data.manufacturerState}` : '—'} />
            </TraceStep>

            <ChevronDown />

            {/* Product */}
            <TraceStep icon={Package} color="bg-orange-100 text-orange-800" title="Product">
              <Row label="Name"             value={data.productName} />
              <Row label="Description"      value={data.productDescription || '—'} />
              <Row label="Price"            value={data.productPrice ? `₹${data.productPrice}` : '—'} />
              <Row label="Manufacturing"    value={data.manufacturingDate ? new Date(data.manufacturingDate).toLocaleDateString('en-IN') : '—'} />
              <Row label="Expiry"           value={data.expiryDate ? new Date(data.expiryDate).toLocaleDateString('en-IN') : '—'} />
            </TraceStep>

            <ChevronDown />

            {/* QR */}
            <TraceStep icon={QrCode} color="bg-gray-100 text-gray-800" title="QR Code">
              <Row label="QR ID"       value={data.qrId} />
              <Row label="Generated"   value={data.qrGeneratedAt ? new Date(data.qrGeneratedAt).toLocaleString('en-IN') : '—'} />
            </TraceStep>
          </div>
        </div>
      )}
    </div>
  )
}

function TraceStep({ icon: Icon, color, title, children }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">{children}</div>
    </div>
  )
}

function Row({ label, value, icon }) {
  return (
    <div className="flex items-start gap-1">
      <span className="text-xs text-gray-400 w-28 shrink-0 pt-0.5">{label}:</span>
      <span className="text-xs font-medium text-gray-700 flex items-center gap-1">{icon}{value || '—'}</span>
    </div>
  )
}

function ChevronDown() {
  return (
    <div className="flex justify-center">
      <div className="w-px h-4 bg-gray-200" />
    </div>
  )
}
