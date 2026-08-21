import axios from 'axios'

const BASE_URL = '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — auto logout
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  manufacturerRegister: (data) => api.post('/auth/manufacturer/register', data),
  manufacturerLogin:   (data) => api.post('/auth/manufacturer/login', data),
  adminLogin:          (data) => api.post('/auth/admin/login', data),
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminAPI = {
  getDashboard:               ()         => api.get('/admin/dashboard'),

  // Farmer applications
  getPendingFarmers:          ()         => api.get('/admin/farmers/applications'),
  getAllFarmers:               ()         => api.get('/admin/farmers'),
  getFarmerById:              (id)       => api.get(`/admin/farmers/${id}`),
  approveFarmer:              (id)       => api.post(`/admin/farmers/${id}/approve`),
  rejectFarmer:               (id)       => api.post(`/admin/farmers/${id}/reject`),
  toggleFarmerBlock:          (id)       => api.post(`/admin/farmers/${id}/toggle-block`),

  // Manufacturer applications
  getPendingManufacturers:    ()         => api.get('/admin/manufacturers/applications'),
  getAllManufacturers:         ()         => api.get('/admin/manufacturers'),
  getManufacturerById:        (id)       => api.get(`/admin/manufacturers/${id}`),
  approveManufacturer:        (id)       => api.post(`/admin/manufacturers/${id}/approve`),
  rejectManufacturer:         (id)       => api.post(`/admin/manufacturers/${id}/reject`),
  toggleManufacturerBlock:    (loginId)  => api.post(`/admin/manufacturers/login/${loginId}/toggle-block`),
}

// ─── Manufacturer ─────────────────────────────────────────────────────────────

export const manufacturerAPI = {
  getProfile:         ()                     => api.get('/manufacturer/profile'),
  updateProfile:      (data)                 => api.put('/manufacturer/profile', data),
  getDashboard:       ()                     => api.get('/manufacturer/dashboard'),

  // Supervisor / Farmers
  getAssignedFarmers: ()                     => api.get('/manufacturer/farmers/assigned'),
  getAllFarmers:       ()                     => api.get('/manufacturer/farmers/all'),
  assignFarmer:       (farmerId)             => api.post(`/manufacturer/farmers/${farmerId}/assign`),
  sendMessage:        (data)                 => api.post('/manufacturer/supervisor/message', data),
  getMessages:        ()                     => api.get('/manufacturer/supervisor/messages'),

  // Cultivations
  getCultivations:    ()                     => api.get('/manufacturer/cultivations'),

  // Batches
  getBatches:         ()                     => api.get('/manufacturer/batches'),
  getAllBatches:       ()                     => api.get('/manufacturer/batches/all'),
  updateBatchStatus:  (batchId, status)      => api.put(`/manufacturer/batches/${batchId}/status`, null, { params: { status } }),

  // Products
  getProducts:        ()                     => api.get('/manufacturer/products'),
  createProduct:      (data)                 => api.post('/manufacturer/products/json', data),
  createProductForm:  (formData)             => api.post('/manufacturer/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct:      (id, data)             => api.put(`/manufacturer/products/${id}/json`, data),
  updateProductForm:  (id, formData)         => api.put(`/manufacturer/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // QR
  getQrCodes:         ()                     => api.get('/manufacturer/qr'),
  generateQr:         (productId)            => api.post(`/manufacturer/qr/generate/${productId}`),

  // Traceability
  getTraceability:    (qrId)                 => api.get(`/manufacturer/traceability/${qrId}`),

  // Orders
  getOrders:          ()                     => api.get('/manufacturer/orders'),
  updateOrderStatus:  (orderId, status)      => api.put(`/manufacturer/orders/${orderId}/status`, null, { params: { status } }),

  // Analytics
  getAnalytics:       ()                     => api.get('/manufacturer/analytics'),

  // Notifications
  getNotifications:   ()                     => api.get('/manufacturer/notifications'),
  markNotifRead:      (id)                   => api.post(`/manufacturer/notifications/${id}/read`),
}

// ─── File upload ──────────────────────────────────────────────────────────────

export const fileAPI = {
  upload: (folder, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/files/upload/${folder}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
}
