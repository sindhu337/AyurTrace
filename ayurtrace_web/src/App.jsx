import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Layouts
import AdminLayout from './components/layouts/AdminLayout'
import ManufacturerLayout from './components/layouts/ManufacturerLayout'

// Pages — lazy loaded
const HomePage                    = lazy(() => import('./pages/home/HomePage'))
const ManufacturerRegisterPage    = lazy(() => import('./pages/auth/ManufacturerRegisterPage'))
const ManufacturerLoginPage       = lazy(() => import('./pages/auth/ManufacturerLoginPage'))
const AdminLoginPage              = lazy(() => import('./pages/auth/AdminLoginPage'))

// Admin pages
const AdminDashboard              = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminFarmerApplications     = lazy(() => import('./pages/admin/AdminFarmerApplications'))
const AdminManufacturerApplications = lazy(() => import('./pages/admin/AdminManufacturerApplications'))
const AdminFarmers                = lazy(() => import('./pages/admin/AdminFarmers'))
const AdminManufacturers          = lazy(() => import('./pages/admin/AdminManufacturers'))
const AdminNotifications          = lazy(() => import('./pages/admin/AdminNotifications'))
const AdminProfile                = lazy(() => import('./pages/admin/AdminProfile'))
const AdminBatches                = lazy(() => import('./pages/admin/AdminBatches'))

// Manufacturer pages
const ManufacturerDashboard       = lazy(() => import('./pages/manufacturer/ManufacturerDashboard'))
const ManufacturerSupervisor      = lazy(() => import('./pages/manufacturer/ManufacturerSupervisor'))
const ManufacturerProducts        = lazy(() => import('./pages/manufacturer/ManufacturerProducts'))
const ManufacturerPostProduct     = lazy(() => import('./pages/manufacturer/ManufacturerPostProduct'))
const ManufacturerBatches         = lazy(() => import('./pages/manufacturer/ManufacturerBatches'))
const ManufacturerQR              = lazy(() => import('./pages/manufacturer/ManufacturerQR'))
const ManufacturerTraceability    = lazy(() => import('./pages/manufacturer/ManufacturerTraceability'))
const ManufacturerOrders          = lazy(() => import('./pages/manufacturer/ManufacturerOrders'))
const ManufacturerAnalytics       = lazy(() => import('./pages/manufacturer/ManufacturerAnalytics'))
const ManufacturerNotifications   = lazy(() => import('./pages/manufacturer/ManufacturerNotifications'))
const ManufacturerProfile         = lazy(() => import('./pages/manufacturer/ManufacturerProfile'))

function PageFallback() {
  return <LoadingSpinner text="Loading..." />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/"                         element={<HomePage />} />
            <Route path="/manufacturer/register"    element={<ManufacturerRegisterPage />} />
            <Route path="/manufacturer/login"       element={<ManufacturerLoginPage />} />
            <Route path="/admin/login"              element={<AdminLoginPage />} />

            {/* Admin protected */}
            <Route path="/admin/*" element={
              <ProtectedRoute role="ROLE_ADMIN">
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard"                    element={<AdminDashboard />} />
                    <Route path="farmer-applications"          element={<AdminFarmerApplications />} />
                    <Route path="manufacturer-applications"    element={<AdminManufacturerApplications />} />
                    <Route path="farmers"                      element={<AdminFarmers />} />
                    <Route path="manufacturers"                element={<AdminManufacturers />} />
                    <Route path="batches"                      element={<AdminBatches />} />
                    <Route path="notifications"                element={<AdminNotifications />} />
                    <Route path="profile"                      element={<AdminProfile />} />
                    <Route path="*"                            element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Manufacturer protected */}
            <Route path="/manufacturer/*" element={
              <ProtectedRoute role="ROLE_MANUFACTURER">
                <ManufacturerLayout>
                  <Routes>
                    <Route path="dashboard"     element={<ManufacturerDashboard />} />
                    <Route path="supervisor"    element={<ManufacturerSupervisor />} />
                    <Route path="products"      element={<ManufacturerProducts />} />
                    <Route path="post-product"  element={<ManufacturerPostProduct />} />
                    <Route path="batches"       element={<ManufacturerBatches />} />
                    <Route path="qr"            element={<ManufacturerQR />} />
                    <Route path="traceability"  element={<ManufacturerTraceability />} />
                    <Route path="orders"        element={<ManufacturerOrders />} />
                    <Route path="analytics"     element={<ManufacturerAnalytics />} />
                    <Route path="notifications" element={<ManufacturerNotifications />} />
                    <Route path="profile"       element={<ManufacturerProfile />} />
                    <Route path="*"             element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </ManufacturerLayout>
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
