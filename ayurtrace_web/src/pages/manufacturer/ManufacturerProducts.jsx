import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { manufacturerAPI } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { Package, PackagePlus, Eye, Search, QrCode } from 'lucide-react'

export default function ManufacturerProducts() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewProduct, setViewProduct] = useState(null)

  const load = () => {
    setLoading(true)
    manufacturerAPI.getProducts()
      .then(r => { setProducts(r.data); setFiltered(r.data) })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(products.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.batchNumber || '').toLowerCase().includes(q)
    ))
  }, [search, products])

  const handleGenerateQR = async (productId) => {
    try {
      const r = await manufacturerAPI.generateQr(productId)
      toast.success(`QR generated: ${r.data.qrId}`)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'QR generation failed')
    }
  }

  if (loading) return <LoadingSpinner text="Loading products..." />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="page-title mb-0">Products</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input-field pl-9 text-sm w-56" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Link to="/manufacturer/post-product" className="btn-primary text-sm py-2 flex items-center gap-2">
            <PackagePlus className="w-4 h-4" /> Post Product
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products yet" subtitle="Post your first Ayurvedic product using the button above." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => (
            <div key={p.id} className="card hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="w-full h-36 bg-gradient-to-br from-ayur-50 to-herb-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                  : <Package className="w-10 h-10 text-ayur-300" />
                }
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-base leading-tight">{p.name}</h3>
                <StatusBadge status={p.productStatus} />
              </div>

              {p.category && <p className="text-xs text-gray-400 mb-2">{p.category}</p>}

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.description}</p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-xl font-bold text-ayur-700">₹{p.price}</span>
                <span className="text-xs text-gray-400">Stock: {p.stockQuantity}</span>
              </div>

              {p.batchNumber && (
                <p className="text-xs text-gray-400 mt-1">Batch: <span className="font-mono">{p.batchNumber}</span></p>
              )}

              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <button onClick={() => setViewProduct(p)}
                  className="flex items-center gap-1.5 text-xs btn-outline py-1.5 px-3">
                  <Eye className="w-3.5 h-3.5" /> Details
                </button>
                <button onClick={() => handleGenerateQR(p.id)}
                  className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-semibold py-1.5 px-3 rounded-lg transition-colors">
                  <QrCode className="w-3.5 h-3.5" /> Generate QR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!viewProduct} title="Product Details" onClose={() => setViewProduct(null)} size="lg">
        {viewProduct && (
          <div className="space-y-4">
            {viewProduct.imageUrl && (
              <img src={viewProduct.imageUrl} alt={viewProduct.name} className="w-full h-48 object-cover rounded-xl" />
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['Product Name', viewProduct.name],
                ['Category', viewProduct.category || '—'],
                ['Price', `₹${viewProduct.price}`],
                ['Stock', viewProduct.stockQuantity],
                ['Quality Info', viewProduct.qualityInfo || '—'],
                ['Manufacturing Date', viewProduct.manufacturingDate ? new Date(viewProduct.manufacturingDate).toLocaleDateString('en-IN') : '—'],
                ['Expiry Date', viewProduct.expiryDate ? new Date(viewProduct.expiryDate).toLocaleDateString('en-IN') : '—'],
                ['Batch', viewProduct.batchNumber || '—'],
                ['Status', <StatusBadge key="s" status={viewProduct.productStatus} />],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{l}</p>
                  <p className="text-sm text-gray-700">{v}</p>
                </div>
              ))}
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Description</p>
                <p className="text-sm text-gray-700">{viewProduct.description || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
