import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './features/cart/context/CartContext'
import { AuthProvider } from './features/admin/context/AuthContext'
import ProtectedRoute from './features/admin/components/ProtectedRoute'
import Layout from './shared/Layout'
import AdminLayout from './shared/AdminLayout'
import HomePage from './features/catalog/pages/HomePage'
import CatalogPage from './features/catalog/pages/CatalogPage'
import ProductDetailPage from './features/catalog/pages/ProductDetailPage'
import DeliveryPointsPage from './features/catalog/pages/DeliveryPointsPage'
import FaqContactPage from './features/catalog/pages/FaqContactPage'
import CheckoutPage from './features/checkout/pages/CheckoutPage'
import AdminLoginPage from './features/admin/pages/AdminLoginPage'
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage'
import AdminOrdersPage from './features/admin/pages/AdminOrdersPage'
import AdminDeliveryPage from './features/admin/pages/AdminDeliveryPage'

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/producto/:id" element={<ProductDetailPage />} />
              <Route path="/puntos-de-entrega" element={<DeliveryPointsPage />} />
              <Route path="/faq-contacto" element={<FaqContactPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            {/* Admin Login (no protection) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Routes (protected) */}
            <Route element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
              <Route path="/admin/puntos-entrega" element={<AdminDeliveryPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  )
}

export default App
