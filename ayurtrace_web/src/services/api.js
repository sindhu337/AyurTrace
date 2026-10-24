import axios from 'axios'

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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

export const authAPI = {
  manufacturerRegister: (data) => api.post('/auth/manufacturer/register', data),
  manufacturerLogin: (data) => api.post('/auth/manufacturer/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPendingFarmers: () => api.get('/admin/farmers/applications'),
  getAllFarmers: () => api.get('/admin/farmers'),
  getFarmerById: (id) => api.get(`/admin/farmers/${id}`),
  approveFarmer: (id) => api.post(`/admin/farmers/${id}/approve`),
  rejectFarmer: (id) => api.post(`/admin/farmers/${id}/reject`),
  toggleFarmerBlock: (id) => api.post(`/admin/farmers/${id}/toggle-block`),
  getPendingManufacturers: () => api.get('/admin/manufacturers/applications'),
  getAllManufacturers: () => api.get('/admin/manufacturers'),
  getManufacturerById: (id) => api.get(`/admin/manufacturers/${id}`),
  approveManufacturer: (id) => api.post(`/admin/manufacturers/${id}/approve`),
  rejectManufacturer: (id) => api.post(`/admin/manufacturers/${id}/reject`),
  toggleManufacturerBlock: (id) => api.post(`/admin/manufacturers/login/${id}/toggle-block`),
  getBatches: (status) => api.get('/admin/batches', { params: status ? { status } : {} }),
  getBatch: (id) => api.get(`/admin/batches/${id}`),
  approveBatch: (id) => api.post(`/admin/batches/${id}/approve`),
  rejectBatch: (id, reason) => api.post(`/admin/batches/${id}/reject`, { reason }),
  assignBatch: (id, manufacturerId) => api.post(`/admin/batches/${id}/assign/${manufacturerId}`),
}

export const manufacturerAPI = {
  getProfile: () => api.get('/manufacturer/profile'),
  updateProfile: (data) => api.put('/manufacturer/profile', data),
  getDashboard: () => api.get('/manufacturer/dashboard'),
  getAssignedFarmers: () => api.get('/manufacturer/farmers/assigned'),
  getAllFarmers: () => api.get('/manufacturer/farmers/all'),
  assignFarmer: (farmerId) => api.post(`/manufacturer/farmers/${farmerId}/assign`),
  sendMessage: (data) => api.post('/manufacturer/supervisor/message', data),
  getMessages: () => api.get('/manufacturer/supervisor/messages'),
  getCultivations: () => api.get('/manufacturer/cultivations'),
  getBatches: () => api.get('/manufacturer/batches'),
  updateBatchStatus: (batchId, status) =>
    api.put(`/manufacturer/batches/${batchId}/status`, null, { params: { status } }),
  getProducts: () => api.get('/manufacturer/products'),
  createProduct: (data) => api.post('/manufacturer/products/json', data),
  createProductForm: (formData) => api.post('/manufacturer/products', formData),
  updateProduct: (id, data) => api.put(`/manufacturer/products/${id}/json`, data),
  updateProductForm: (id, formData) => api.put(`/manufacturer/products/${id}`, formData),
  getQrCodes: () => api.get('/manufacturer/qr'),
  generateQr: (productId) => api.post(`/manufacturer/qr/generate/${productId}`),
  getTraceability: (qrId) => api.get(`/manufacturer/traceability/${qrId}`),
  getOrders: () => api.get('/manufacturer/orders'),
  updateOrderStatus: (orderId, status) =>
    api.put(`/manufacturer/orders/${orderId}/status`, null, { params: { status } }),
  getAnalytics: () => api.get('/manufacturer/analytics'),
  getNotifications: () => api.get('/manufacturer/notifications'),
  markNotifRead: (id) => api.post(`/manufacturer/notifications/${id}/read`),
}

export const fileAPI = {
  upload: (folder, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/files/upload/${folder}`, fd)
  },
}
