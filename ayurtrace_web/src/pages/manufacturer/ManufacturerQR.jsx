import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { manufacturerAPI } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { QrCode, Download, Eye, Package } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function ManufacturerQR() {
  const [qrCodes, setQrCodes] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewQR, setViewQR] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      manufacturerAPI.getQrCodes(),
      manufacturerAPI.getProducts(),
    ]).then(([qr, pr]) => {
      setQrCodes(qr.data)
      setProducts(pr.data.filter(p => p.batchId)) // only products with a batch
    }).catch(() => toast.error('Failed to load QR data'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleGenerate = async () => {
    if (!selectedProduct) { toast.error('Select a product'); return }
    setGenerating(true)
    try {
      const r = await manufacturerAPI.generateQr(parseInt(selectedProduct))
      toast.success(`QR Code generated: ${r.data.qrId}`)
      setSelectedProduct('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'QR generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = (qrId) => {
    const svg = document.getElementById(`qr-${qrId}`)
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${qrId}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingSpinner text="Loading QR codes..." />

  return (
    <div>
      <h1 className="page-title">QR Code Management</h1>

      {/* Generate section */}
      <div className="card mb-6">
        <h2 className="section-title mb-4">Generate New QR Code</h2>
        <p className="text-sm text-gray-500 mb-4">
          Generate a QR code for a product. The product must be linked to a batch for traceability.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <select className="input-field flex-1 max-w-sm" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
            <option value="">— Select a product with batch —</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Batch: {p.batchNumber})</option>
            ))}
          </select>
          <button onClick={handleGenerate} disabled={generating || !selectedProduct}
            className="btn-primary flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            {generating ? 'Generating...' : 'Generate QR'}
          </button>
        </div>
        {products.length === 0 && (
          <p className="text-xs text-red-500 mt-2">No products with linked batches found. Post a product and link it to a batch first.</p>
        )}
      </div>

      {/* QR Code grid */}
      {qrCodes.length === 0 ? (
        <EmptyState icon={QrCode} title="No QR codes generated yet" subtitle="Generate your first QR code above." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {qrCodes.map(q => (
            <div key={q.id} className="card text-center hover:shadow-md transition-shadow">
              {/* QR image */}
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-white border border-gray-200 rounded-xl inline-block">
                  <QRCodeSVG id={`qr-${q.qrId}`} value={q.qrId} size={120} level="H" />
                </div>
              </div>

              <p className="font-mono text-sm font-bold text-ayur-700 mb-1">{q.qrId}</p>
              <p className="text-sm text-gray-600 font-medium mb-0.5">{q.productName}</p>
              <p className="text-xs text-gray-400 mb-1">Batch: {q.batchNumber}</p>
              <p className="text-xs text-gray-400">
                {q.generatedAt ? new Date(q.generatedAt).toLocaleDateString('en-IN') : '—'}
              </p>

              <div className="flex gap-2 justify-center mt-4 pt-4 border-t">
                <button onClick={() => setViewQR(q)}
                  className="text-xs btn-outline py-1.5 px-3 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button onClick={() => handleDownload(q.qrId)}
                  className="text-xs btn-primary py-1.5 px-3 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View QR Modal */}
      <Modal open={!!viewQR} title="QR Code Details" onClose={() => setViewQR(null)} size="md">
        {viewQR && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white border-2 border-gray-200 rounded-2xl inline-block">
                <QRCodeSVG value={viewQR.qrId} size={200} level="H" />
              </div>
            </div>
            <p className="font-mono text-lg font-bold text-ayur-700 mb-4">{viewQR.qrId}</p>
            <div className="text-left space-y-2 bg-gray-50 rounded-xl p-4">
              {[
                ['Product', viewQR.productName],
                ['Batch', viewQR.batchNumber],
                ['Manufacturer ID', viewQR.manufacturerIdCode],
                ['Company', viewQR.manufacturerCompanyName],
                ['Generated', viewQR.generatedAt ? new Date(viewQR.generatedAt).toLocaleString('en-IN') : '—'],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">{l}:</span>
                  <span className="text-gray-800">{v || '—'}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-ayur-50 rounded-lg text-xs text-ayur-700">
              Customer scans this QR to view the complete traceability chain.
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
