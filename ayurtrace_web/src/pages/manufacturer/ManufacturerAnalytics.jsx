import React, { useEffect, useState } from 'react'
import { manufacturerAPI } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import StatCard from '../../components/ui/StatCard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { BarChart2, TrendingUp, ShoppingCart, Package, Layers, QrCode } from 'lucide-react'

const COLORS = ['#16a34a', '#eab308', '#3b82f6', '#ef4444', '#8b5cf6', '#f97316']

export default function ManufacturerAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    manufacturerAPI.getAnalytics()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading analytics..." />
  if (!data) return <p className="text-gray-500">Analytics data unavailable.</p>

  const orderStatusData = [
    { name: 'Pending',   value: data.pendingOrders   || 0 },
    { name: 'Confirmed', value: data.confirmedOrders || 0 },
    { name: 'Delivered', value: data.deliveredOrders || 0 },
    { name: 'Cancelled', value: data.cancelledOrders || 0 },
  ]

  const batchData = [
    { name: 'All Batches',   value: data.totalBatchesReceived  || 0 },
    { name: 'Processed',     value: data.totalBatchesProcessed || 0 },
  ]

  return (
    <div>
      <h1 className="page-title">Analytics</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products"   value={data.totalProducts}        icon={Package}      color="ayur"   />
        <StatCard label="Total Orders"     value={data.totalOrders}          icon={ShoppingCart} color="blue"   />
        <StatCard label="Pending Orders"   value={data.pendingOrders}        icon={ShoppingCart} color="herb"   />
        <StatCard label="Total Sales"      value={`₹${Number(data.totalSales || 0).toFixed(0)}`} icon={TrendingUp} color="ayur" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Batches Received"  value={data.totalBatchesReceived}  icon={Layers}  color="purple" />
        <StatCard label="Batches Processed" value={data.totalBatchesProcessed} icon={Layers}  color="ayur"   />
        <StatCard label="QR Codes"          value={data.qrCodesGenerated}      icon={QrCode}  color="orange" />
        <StatCard label="Delivered Orders"  value={data.deliveredOrders}       icon={TrendingUp} color="ayur" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Status Pie */}
        <div className="card">
          <h2 className="section-title">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                {orderStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Batches Bar */}
        <div className="card">
          <h2 className="section-title">Batch Overview</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={batchData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Batches" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
