import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './features/cart/context/CartContext'
import Layout from './shared/Layout'
import AdminLayout from './shared/AdminLayout'
import HomePage from './features/catalog/pages/HomePage'
import CatalogPage from './features/catalog/pages/CatalogPage'
import ProductDetailPage from './features/catalog/pages/ProductDetailPage'
import DeliveryPointsPage from './features/catalog/pages/DeliveryPointsPage'
import FaqContactPage from './features/catalog/pages/FaqContactPage'
import CheckoutPage from './features/checkout/pages/CheckoutPage'
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage'

function App() {
  return (
    <CartProvider>
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

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
