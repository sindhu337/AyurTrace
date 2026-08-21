import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { manufacturerAPI, fileAPI } from '../../services/api'
import { PackagePlus, Upload, ArrowLeft } from 'lucide-react'

export default function ManufacturerPostProduct() {
  const navigate = useNavigate()
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '', category: '', price: '',
    stockQuantity: '', qualityInfo: '', manufacturingDate: '',
    expiryDate: '', batchId: '',
  })

  useEffect(() => {
    manufacturerAPI.getBatches()
      .then(r => setBatches(r.data))
      .catch(() => {})
  }, [])

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.price || parseFloat(form.price) <= 0) { toast.error('Enter a valid price'); return }
    setLoading(true)
    try {
      let imageUrl = null
      if (imageFile) {
        const r = await fileAPI.upload('products', imageFile)
        imageUrl = r.data?.data || null
      }

      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity) || 0,
        qualityInfo: form.qualityInfo,
        manufacturingDate: form.manufacturingDate || null,
        expiryDate: form.expiryDate || null,
        batchId: form.batchId ? parseInt(form.batchId) : null,
      }

      // If image was uploaded, add imageUrl manually via JSON endpoint workaround
      if (imageUrl) payload.imageUrl = imageUrl

      await manufacturerAPI.createProduct(payload)
      toast.success('Product posted successfully!')
      navigate('/manufacturer/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/manufacturer/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="page-title mb-0">Post New Product</h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="section-title border-b pb-2">Product Information</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
                <input className="input-field" value={form.name} onChange={set('name')} required placeholder="e.g. Ashwagandha Capsules" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <input className="input-field" value={form.category} onChange={set('category')} placeholder="e.g. Capsules, Powder, Oil" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹) *</label>
                <input className="input-field" type="number" min="0.01" step="0.01" value={form.price} onChange={set('price')} required placeholder="e.g. 250.00" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Available Quantity *</label>
                <input className="input-field" type="number" min="0" value={form.stockQuantity} onChange={set('stockQuantity')} required placeholder="Units in stock" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Quality Information</label>
                <input className="input-field" value={form.qualityInfo} onChange={set('qualityInfo')} placeholder="e.g. ISO certified, Organic" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea className="input-field resize-none" rows={3} value={form.description} onChange={set('description')}
                  placeholder="Product description, benefits, usage instructions..." />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h2 className="section-title border-b pb-2">Dates</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Manufacturing Date</label>
                <input className="input-field" type="date" value={form.manufacturingDate} onChange={set('manufacturingDate')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date</label>
                <input className="input-field" type="date" value={form.expiryDate} onChange={set('expiryDate')} />
              </div>
            </div>
          </div>

          {/* Batch */}
          <div>
            <h2 className="section-title border-b pb-2">Related Batch</h2>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Select Batch (for traceability)</label>
              <select className="input-field" value={form.batchId} onChange={set('batchId')}>
                <option value="">— No batch linked —</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.batchNumber} — {b.herbName} ({b.farmerName})</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Linking a batch enables complete QR traceability for this product.</p>
            </div>
          </div>

          {/* Image */}
          <div>
            <h2 className="section-title border-b pb-2">Product Image</h2>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Upload Image</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden">
                {imagePreview
                  ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm">Click to upload product image</span>
                      <span className="text-xs mt-1">JPG, PNG up to 10MB</span>
                    </div>
                  )
                }
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <button type="button" onClick={() => navigate('/manufacturer/products')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <PackagePlus className="w-4 h-4" />
              {loading ? 'Posting...' : 'Post Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
