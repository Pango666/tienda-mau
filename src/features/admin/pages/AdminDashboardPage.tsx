import { useState, useEffect, useCallback } from 'react'
import {
  fetchDashboardStats,
  fetchAllProducts,
  createProduct,
  deleteProduct,
  updateVariantStock,
  createVariant,
  type DashboardStats,
} from '../services/adminService'
import type { ProductWithDetails } from '../../../types'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showVariantModal, setShowVariantModal] = useState<string | null>(null)
  const [editingStock, setEditingStock] = useState<{ variantId: string; stock: number } | null>(null)

  // New product form
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    material: '',
    base_price: 0,
  })

  // New variant form
  const [newVariant, setNewVariant] = useState({
    size: '',
    color: '',
    stock: 0,
    sku: '',
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    const [statsData, productsData] = await Promise.all([
      fetchDashboardStats(),
      fetchAllProducts(),
    ])
    setStats(statsData)
    setProducts(productsData)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!newProduct.title || !newProduct.base_price) return

    const id = await createProduct({
      title: newProduct.title,
      description: newProduct.description || undefined,
      material: newProduct.material || undefined,
      base_price: newProduct.base_price,
    })

    if (id) {
      setShowAddModal(false)
      setNewProduct({ title: '', description: '', material: '', base_price: 0 })
      await loadData()
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    const ok = await deleteProduct(id)
    if (ok) await loadData()
  }

  async function handleUpdateStock() {
    if (!editingStock) return
    const ok = await updateVariantStock(editingStock.variantId, editingStock.stock)
    if (ok) {
      setEditingStock(null)
      await loadData()
    }
  }

  async function handleCreateVariant(e: React.FormEvent) {
    e.preventDefault()
    if (!showVariantModal || !newVariant.size || !newVariant.color) return

    const ok = await createVariant({
      product_id: showVariantModal,
      size: newVariant.size,
      color: newVariant.color,
      stock: newVariant.stock,
      sku: newVariant.sku || undefined,
    })

    if (ok) {
      setShowVariantModal(null)
      setNewVariant({ size: '', color: '', stock: 0, sku: '' })
      await loadData()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">autorenew</span>
      </div>
    )
  }

  return (
    <>
      {/* Sub-Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-low p-6 rounded-none shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-primary-container"></span>
            <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">[ SYSTEM STATUS // LIVE DATA ]</span>
            <span className="text-outline-variant font-label-mono text-label-mono">/</span>
            <span className="font-label-mono text-label-mono text-secondary uppercase">SUPABASE CONNECTED</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">PANEL DE CONTROL // STOCK LIVE</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2.5 font-label-caps text-label-caps text-on-surface uppercase tracking-wider transition-colors shadow-sm"
            type="button"
            onClick={loadData}
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">refresh</span>
            ACTUALIZAR
          </button>
          <button
            className="flex items-center gap-2 bg-primary-container hover:bg-white text-on-primary-container hover:text-surface px-5 py-2.5 font-label-caps text-label-caps uppercase tracking-wider font-bold transition-all shadow-md"
            type="button"
            onClick={() => setShowAddModal(true)}
          >
            <span className="material-symbols-outlined text-[20px]">add_box</span>
            AÑADIR NUEVO PRODUCTO (+)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            {
              label: 'KPI // 001 - VENTAS DEL DÍA', icon: 'payments',
              value: `Bs.${stats.salesToday.toFixed(2)}`, unit: 'BOB',
            },
            {
              label: 'KPI // 002 - PEDIDOS PENDIENTES', icon: 'shopping_cart_checkout',
              value: String(stats.pendingOrders), unit: 'ÓRDENES ACTIVAS',
            },
            {
              label: 'KPI // 003 - INVENTARIO TOTAL', icon: 'warehouse',
              value: String(stats.totalStock), unit: 'UNIDADES TOTALES',
            },
            {
              label: 'KPI // 004 - PRODUCTOS ACTIVOS', icon: 'inventory_2',
              value: String(stats.totalProducts), unit: 'EN CATÁLOGO',
            },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-surface-container-low p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-colors">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 via-transparent to-transparent pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">{kpi.label}</span>
                  <span className={`material-symbols-outlined text-[20px] ${idx === 0 ? 'text-primary' : 'text-outline'}`}>{kpi.icon}</span>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">{kpi.value}</span>
                  <span className="font-label-mono text-label-mono text-outline uppercase">{kpi.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-surface-container-low shadow-md">
        <div className="p-5 flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface uppercase">INVENTARIO ACTIVO</h2>
          </div>
          <span className="font-label-mono text-label-mono text-outline">{products.length} PRODUCTOS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container">
                <th className="p-3 text-left font-label-mono text-label-mono text-outline uppercase tracking-wider">PRODUCTO</th>
                <th className="p-3 text-left font-label-mono text-label-mono text-outline uppercase tracking-wider">VARIANTES</th>
                <th className="p-3 text-right font-label-mono text-label-mono text-outline uppercase tracking-wider">PRECIO</th>
                <th className="p-3 text-right font-label-mono text-label-mono text-outline uppercase tracking-wider">STOCK TOTAL</th>
                <th className="p-3 text-center font-label-mono text-label-mono text-outline uppercase tracking-wider">STATUS</th>
                <th className="p-3 text-center font-label-mono text-label-mono text-outline uppercase tracking-wider">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-4xl text-outline">inventory_2</span>
                      <span className="font-label-mono text-body-md text-on-surface-variant">NO HAY PRODUCTOS REGISTRADOS</span>
                      <button
                        className="font-label-mono text-label-mono text-primary hover:underline uppercase"
                        onClick={() => setShowAddModal(true)}
                      >
                        + CREAR PRIMER PRODUCTO
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map(product => {
                  const variants = product.product_variants || []
                  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
                  const status = totalStock === 0 ? 'AGOTADO' : totalStock <= 5 ? 'LIMITED' : 'EN STOCK'

                  return (
                    <tr key={product.id} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {product.product_images?.[0] && (
                            <img
                              src={product.product_images[0].image_url}
                              alt={product.title}
                              className="w-10 h-10 object-cover bg-surface-container"
                            />
                          )}
                          <div>
                            <span className="font-headline-sm text-body-sm font-bold text-on-surface uppercase block">{product.title}</span>
                            <span className="font-label-mono text-[10px] text-on-surface-variant">
                              {product.description?.slice(0, 50) || 'Sin descripción'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          {variants.slice(0, 3).map(v => (
                            <div key={v.id} className="flex items-center gap-2">
                              <span className="font-label-mono text-[10px] text-on-surface-variant">
                                {v.size}/{v.color}
                              </span>
                              {editingStock?.variantId === v.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    className="w-16 bg-surface-container px-2 py-0.5 font-label-mono text-[11px] text-on-surface border border-primary-container"
                                    value={editingStock.stock}
                                    onChange={e => setEditingStock({ ...editingStock, stock: Number(e.target.value) })}
                                    min={0}
                                  />
                                  <button onClick={handleUpdateStock} className="text-primary hover:text-on-surface">
                                    <span className="material-symbols-outlined text-[14px]">check</span>
                                  </button>
                                  <button onClick={() => setEditingStock(null)} className="text-outline hover:text-on-surface">
                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="font-label-mono text-[10px] text-primary hover:underline"
                                  onClick={() => setEditingStock({ variantId: v.id, stock: v.stock })}
                                >
                                  [{v.stock} u.]
                                </button>
                              )}
                            </div>
                          ))}
                          {variants.length > 3 && (
                            <span className="font-label-mono text-[10px] text-outline">+{variants.length - 3} más</span>
                          )}
                          <button
                            className="font-label-mono text-[10px] text-primary hover:underline mt-1"
                            onClick={() => setShowVariantModal(product.id)}
                          >
                            + AÑADIR VARIANTE
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right font-label-mono text-body-sm font-bold text-on-surface">
                        Bs.{product.base_price.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-label-mono text-body-sm text-on-surface">{totalStock}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 font-label-mono text-[10px] font-bold uppercase ${
                          status === 'AGOTADO' ? 'bg-error-container text-on-error-container' :
                          status === 'LIMITED' ? 'bg-primary-container text-on-primary-container' :
                          'bg-surface-container-high text-on-surface'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1 text-outline hover:text-error transition-colors"
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-high max-w-lg w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">// NUEVO PRODUCTO</span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">REGISTRAR PIEZA</h3>
              </div>
              <button className="p-2 bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors" onClick={() => setShowAddModal(false)} type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">TÍTULO *</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={e => setNewProduct(p => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="NOMBRE DEL PRODUCTO"
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-secondary-container"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">DESCRIPCIÓN</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                  placeholder="DESCRIPCIÓN DEL PRODUCTO"
                  rows={3}
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-secondary-container resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">MATERIAL</label>
                  <input
                    type="text"
                    value={newProduct.material}
                    onChange={e => setNewProduct(p => ({ ...p, material: e.target.value }))}
                    placeholder="EJ: ALGODÓN 100%"
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-secondary-container"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">PRECIO (Bs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.base_price || ''}
                    onChange={e => setNewProduct(p => ({ ...p, base_price: Number(e.target.value) }))}
                    required
                    placeholder="0.00"
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-secondary-container"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold uppercase tracking-tight hover:bg-white hover:text-surface transition-all shadow-md"
              >
                CREAR PRODUCTO
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Variant Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-high max-w-md w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">// NUEVA VARIANTE</span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">AÑADIR SKU</h3>
              </div>
              <button className="p-2 bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors" onClick={() => setShowVariantModal(null)} type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateVariant} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">TALLA *</label>
                  <input
                    type="text"
                    value={newVariant.size}
                    onChange={e => setNewVariant(v => ({ ...v, size: e.target.value }))}
                    required
                    placeholder="S, M, L..."
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-secondary-container"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">COLOR *</label>
                  <input
                    type="text"
                    value={newVariant.color}
                    onChange={e => setNewVariant(v => ({ ...v, color: e.target.value }))}
                    required
                    placeholder="NEGRO, BLANCO..."
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-secondary-container"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">STOCK *</label>
                  <input
                    type="number"
                    min="0"
                    value={newVariant.stock}
                    onChange={e => setNewVariant(v => ({ ...v, stock: Number(e.target.value) }))}
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-secondary-container"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">SKU</label>
                  <input
                    type="text"
                    value={newVariant.sku}
                    onChange={e => setNewVariant(v => ({ ...v, sku: e.target.value }))}
                    placeholder="OKP-001"
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-secondary-container"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold uppercase tracking-tight hover:bg-white hover:text-surface transition-all shadow-md"
              >
                CREAR VARIANTE
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
