import { useState, useEffect, useCallback } from 'react'
import {
  fetchDashboardStats,
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateVariantStock,
  createVariant,
  updateVariant,
  deleteVariant,
  createCategory,
  deleteCategory,
  uploadProductImage,
  createProductImage,
  deleteProductImage,
  type DashboardStats,
} from '../services/adminService'
import { fetchCategories } from '../../catalog/services/catalogService'
import type { ProductWithDetails, Category } from '../../../types'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'inventory' | 'categories'>('inventory')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<ProductWithDetails | null>(null)
  const [showVariantModal, setShowVariantModal] = useState<string | null>(null)
  const [showEditVariantModal, setShowEditVariantModal] = useState<any | null>(null)
  const [editingStock, setEditingStock] = useState<{ variantId: string; stock: number } | null>(null)

  // New product form
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    material: '',
    care_instructions: '',
    base_price: 0,
    category_id: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // New category form
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
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
    const [statsData, productsData, categoriesData] = await Promise.all([
      fetchDashboardStats(),
      fetchAllProducts(),
      fetchCategories(),
    ])
    setStats(statsData)
    setProducts(productsData)
    setCategories(categoriesData)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!newProduct.title || !newProduct.base_price) return
    setIsUploading(true)

    const id = await createProduct({
      title: newProduct.title,
      description: newProduct.description || undefined,
      material: newProduct.material || undefined,
      care_instructions: newProduct.care_instructions || undefined,
      base_price: newProduct.base_price,
      category_id: newProduct.category_id || undefined,
    })

    if (id) {
      if (imageFile) {
        const imageUrl = await uploadProductImage(imageFile)
        if (imageUrl) {
          await createProductImage(id, imageUrl, true)
        }
      }
      setShowAddModal(false)
      setNewProduct({ title: '', description: '', material: '', care_instructions: '', base_price: 0, category_id: '' })
      setImageFile(null)
      await loadData()
    }
    setIsUploading(false)
  }

  async function handleEditProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!showEditModal) return
    setIsUploading(true)

    const ok = await updateProduct(showEditModal.id, {
      title: showEditModal.title,
      description: showEditModal.description || '',
      material: showEditModal.material || '',
      care_instructions: showEditModal.care_instructions || '',
      base_price: showEditModal.base_price,
      category_id: showEditModal.category_id || undefined,
    })

    if (ok) {
      if (imageFile) {
        const imageUrl = await uploadProductImage(imageFile)
        if (imageUrl) {
          await createProductImage(showEditModal.id, imageUrl, true)
        }
      }
      setShowEditModal(null)
      setImageFile(null)
      await loadData()
    }
    setIsUploading(false)
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategory.name || !newCategory.slug) return
    const ok = await createCategory({ name: newCategory.name, slug: newCategory.slug })
    if (ok) {
      setNewCategory({ name: '', slug: '' })
      await loadData()
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return
    const ok = await deleteCategory(id)
    if (ok) await loadData()
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('¿Estás seguro de desactivar (eliminar) este producto?')) return
    const ok = await deleteProduct(id)
    if (ok) await loadData()
  }

  async function handleReactivateProduct(id: string) {
    if (!confirm('¿Estás seguro de reactivar este producto?')) return
    const ok = await updateProduct(id, { is_active: true } as any)
    if (ok) await loadData()
  }

  async function handleDeleteImage(imageId: string, imageUrl: string) {
    if (!confirm('¿Seguro que deseas eliminar esta imagen?')) return
    setIsUploading(true)
    const ok = await deleteProductImage(imageId, imageUrl)
    if (ok) {
      if (showEditModal) {
        setShowEditModal({
          ...showEditModal,
          product_images: showEditModal.product_images?.filter(img => img.id !== imageId)
        })
      }
      await loadData()
    }
    setIsUploading(false)
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

  async function handleEditVariantSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!showEditVariantModal) return

    const ok = await updateVariant(showEditVariantModal.id, {
      size: showEditVariantModal.size,
      color: showEditVariantModal.color,
      stock: showEditVariantModal.stock,
      sku: showEditVariantModal.sku || undefined,
    })

    if (ok) {
      setShowEditVariantModal(null)
      await loadData()
    }
  }

  async function handleDeleteVariant(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta variante por completo?')) return
    const ok = await deleteVariant(id)
    if (ok) {
      setShowEditVariantModal(null)
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

      {/* Tabs */}
      <div className="flex gap-4 px-6 pt-4 bg-surface-container-low border-b border-outline-variant/20">
        <button
          className={`pb-3 font-headline-sm text-body-md font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'inventory' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => setActiveTab('inventory')}
        >
          INVENTARIO Y PRODUCTOS
        </button>
        <button
          className={`pb-3 font-headline-sm text-body-md font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => setActiveTab('categories')}
        >
          CATEGORÍAS DE TIENDA
        </button>
      </div>

      {/* KPI Cards */}
      {activeTab === 'inventory' && stats && (
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

      {/* Inventory Section */}
      {activeTab === 'inventory' && (
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
                            <span className="font-headline-sm text-body-sm font-bold text-on-surface uppercase block">
                              {product.title}
                              {product.is_active === false && <span className="text-error font-bold ml-2 text-[10px] bg-error/10 px-1 py-0.5 rounded-sm">(INACTIVO)</span>}
                            </span>
                            <span className="font-label-mono text-[10px] text-on-surface-variant">
                              {product.description?.slice(0, 50) || 'Sin descripción'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-2">
                          {variants.map(v => (
                            <div key={v.id} className="flex flex-wrap items-center justify-between bg-surface-container-highest p-1.5 px-2">
                              <span className="font-label-mono text-[11px] font-bold text-on-surface uppercase">
                                {v.size} - {v.color}
                              </span>
                              {editingStock?.variantId === v.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    className="w-14 bg-surface-container px-1 py-0.5 font-label-mono text-[11px] text-on-surface border border-primary text-center outline-none"
                                    value={editingStock.stock}
                                    onChange={e => setEditingStock({ ...editingStock, stock: Number(e.target.value) })}
                                    min={0}
                                  />
                                  <button onClick={handleUpdateStock} className="bg-primary text-white p-0.5 hover:bg-on-surface transition-colors">
                                    <span className="material-symbols-outlined text-[14px] block">check</span>
                                  </button>
                                  <button onClick={() => setEditingStock(null)} className="bg-outline text-white p-0.5 hover:bg-on-surface transition-colors">
                                    <span className="material-symbols-outlined text-[14px] block">close</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className={`font-label-mono text-[11px] font-bold ${v.stock === 0 ? 'text-error' : 'text-primary'}`}>
                                    {v.stock} u.
                                  </span>
                                  <button
                                    className="text-outline hover:text-primary transition-colors flex items-center"
                                    onClick={() => setShowEditVariantModal(v)}
                                    title="Editar Variante Completa"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">settings</span>
                                  </button>
                                  <button
                                    className="text-outline hover:text-primary transition-colors flex items-center"
                                    onClick={() => setEditingStock({ variantId: v.id, stock: v.stock })}
                                    title="Editar Stock Rápido"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                          <button
                            className="font-label-mono text-[11px] bg-primary-container text-on-primary-container font-bold py-1.5 hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-1 w-full"
                            onClick={() => setShowVariantModal(product.id)}
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            AÑADIR VARIANTE
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
                            onClick={() => setShowEditModal(product)}
                            className="p-1 text-outline hover:text-primary transition-colors"
                            title="Editar Producto"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          {product.is_active === false ? (
                            <button
                              onClick={() => handleReactivateProduct(product.id)}
                              className="p-1 text-outline hover:text-success transition-colors"
                              title="Reactivar Producto"
                            >
                              <span className="material-symbols-outlined text-[18px] text-green-500">restore</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1 text-outline hover:text-error transition-colors"
                              title="Desactivar (Eliminar)"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          )}
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
      )}

      {/* Categories Section */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-low shadow-md">
            <div className="p-5 flex items-center justify-between border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">category</span>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface uppercase">CATEGORÍAS REGISTRADAS</h2>
              </div>
              <span className="font-label-mono text-label-mono text-outline">{categories.length} CATEGORÍAS</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container">
                    <th className="p-3 text-left font-label-mono text-label-mono text-outline uppercase tracking-wider">NOMBRE</th>
                    <th className="p-3 text-left font-label-mono text-label-mono text-outline uppercase tracking-wider">SLUG (URL)</th>
                    <th className="p-3 text-center font-label-mono text-label-mono text-outline uppercase tracking-wider">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
                      <td className="p-3 font-headline-sm text-body-sm font-bold text-on-surface uppercase">{cat.name}</td>
                      <td className="p-3 font-label-mono text-body-sm text-on-surface-variant">{cat.slug}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1 text-outline hover:text-error transition-colors"
                          title="Eliminar Categoría"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center font-label-mono text-body-md text-on-surface-variant">
                        NO HAY CATEGORÍAS REGISTRADAS
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-surface-container-low shadow-md p-6 flex flex-col gap-6 h-fit">
            <div>
              <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">// NUEVO REGISTRO</span>
              <h3 className="font-headline-md text-headline-sm text-on-surface uppercase font-bold">AÑADIR CATEGORÍA</h3>
            </div>
            <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">NOMBRE *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={e => setNewCategory(c => ({ ...c, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))}
                  required
                  placeholder="Ej: Poleras"
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-on-surface-variant/70"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">SLUG *</label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={e => setNewCategory(c => ({ ...c, slug: e.target.value }))}
                  required
                  placeholder="ej-poleras"
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-on-surface-variant/70"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold uppercase tracking-tight hover:bg-white hover:text-surface transition-all shadow-md mt-2"
              >
                GUARDAR CATEGORÍA
              </button>
            </form>
          </div>
        </div>
      )}

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">TÍTULO *</label>
                  <input
                    type="text"
                    value={newProduct.title}
                    onChange={e => setNewProduct(p => ({ ...p, title: e.target.value }))}
                    required
                    placeholder="NOMBRE DEL PRODUCTO"
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-on-surface-variant/70"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">CATEGORÍA</label>
                  <select
                    value={newProduct.category_id}
                    onChange={e => setNewProduct(p => ({ ...p, category_id: e.target.value }))}
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase"
                  >
                    <option value="">-- SELECCIONAR --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">DESCRIPCIÓN</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                  placeholder="DESCRIPCIÓN DEL PRODUCTO"
                  rows={3}
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-on-surface-variant/70 resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">CUIDADOS Y LAVADO</label>
                <textarea
                  value={newProduct.care_instructions}
                  onChange={e => setNewProduct(p => ({ ...p, care_instructions: e.target.value }))}
                  placeholder="EJ: LAVAR A MANO. NO USAR BLANQUEADOR."
                  rows={2}
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-on-surface-variant/70 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">MATERIAL</label>
                  <input
                    type="text"
                    value={newProduct.material}
                    onChange={e => setNewProduct(p => ({ ...p, material: e.target.value }))}
                    placeholder="EJ: ALGODÓN 100%"
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-on-surface-variant/70"
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
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-on-surface-variant/70"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">IMAGEN DEL PRODUCTO</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                  className="font-label-mono text-body-sm text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-bold file:bg-primary-container file:text-on-primary-container hover:file:bg-white hover:file:text-surface transition-all cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold uppercase tracking-tight hover:bg-white hover:text-surface transition-all shadow-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                    GUARDANDO...
                  </>
                ) : (
                  'CREAR PRODUCTO'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-high max-w-lg w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">// EDICIÓN DE PRODUCTO</span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">EDITAR PIEZA</h3>
              </div>
              <button className="p-2 bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors" onClick={() => setShowEditModal(null)} type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEditProduct} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">TÍTULO *</label>
                  <input
                    type="text"
                    value={showEditModal.title}
                    onChange={e => setShowEditModal(p => p ? { ...p, title: e.target.value } : null)}
                    required
                    placeholder="NOMBRE DEL PRODUCTO"
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-on-surface-variant/70"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">CATEGORÍA</label>
                  <select
                    value={showEditModal.category_id || ''}
                    onChange={e => setShowEditModal(p => p ? { ...p, category_id: e.target.value } : null)}
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase"
                  >
                    <option value="">-- SELECCIONAR --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">DESCRIPCIÓN</label>
                <textarea
                  value={showEditModal.description || ''}
                  onChange={e => setShowEditModal(p => p ? { ...p, description: e.target.value } : null)}
                  placeholder="DESCRIPCIÓN DEL PRODUCTO"
                  rows={3}
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-on-surface-variant/70 resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">CUIDADOS Y LAVADO</label>
                <textarea
                  value={showEditModal.care_instructions || ''}
                  onChange={e => setShowEditModal(p => p ? { ...p, care_instructions: e.target.value } : null)}
                  placeholder="EJ: LAVAR A MANO. NO USAR BLANQUEADOR."
                  rows={2}
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-on-surface-variant/70 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">MATERIAL</label>
                  <input
                    type="text"
                    value={showEditModal.material || ''}
                    onChange={e => setShowEditModal(p => p ? { ...p, material: e.target.value } : null)}
                    placeholder="EJ: ALGODÓN 100%"
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-on-surface-variant/70"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">PRECIO (Bs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={showEditModal.base_price || ''}
                    onChange={e => setShowEditModal(p => p ? { ...p, base_price: Number(e.target.value) } : null)}
                    required
                    placeholder="0.00"
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-on-surface-variant/70"
                  />
                </div>
              </div>
              
              {showEditModal.product_images && showEditModal.product_images.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">IMÁGENES ACTUALES</label>
                  <div className="grid grid-cols-4 gap-2">
                    {showEditModal.product_images.map(img => (
                      <div key={img.id} className="relative group bg-surface-container aspect-square shadow-sm">
                        <img src={img.image_url} alt="Producto" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id, img.image_url)}
                          className="absolute top-1 right-1 bg-error-container text-on-error-container p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-error hover:text-white"
                          title="Eliminar imagen"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">AÑADIR NUEVA IMAGEN</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                  className="font-label-mono text-body-sm text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-bold file:bg-primary-container file:text-on-primary-container hover:file:bg-white hover:file:text-surface transition-all cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold uppercase tracking-tight hover:bg-white hover:text-surface transition-all shadow-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                    GUARDANDO...
                  </>
                ) : (
                  'GUARDAR CAMBIOS'
                )}
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
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-on-surface-variant/70"
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
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-on-surface-variant/70"
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
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-on-surface-variant/70"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">SKU</label>
                  <input
                    type="text"
                    value={newVariant.sku}
                    onChange={e => setNewVariant(v => ({ ...v, sku: e.target.value }))}
                    placeholder="OKP-001"
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-on-surface-variant/70"
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

      {/* Edit Variant Modal */}
      {showEditVariantModal && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-high max-w-md w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">// EDICIÓN DE VARIANTE</span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">MODIFICAR SKU</h3>
              </div>
              <button className="p-2 bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors" onClick={() => setShowEditVariantModal(null)} type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEditVariantSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">TALLA *</label>
                  <input
                    type="text"
                    value={showEditVariantModal.size}
                    onChange={e => setShowEditVariantModal({ ...showEditVariantModal, size: e.target.value })}
                    required
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">COLOR *</label>
                  <input
                    type="text"
                    value={showEditVariantModal.color}
                    onChange={e => setShowEditVariantModal({ ...showEditVariantModal, color: e.target.value })}
                    required
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">STOCK *</label>
                  <input
                    type="number"
                    min="0"
                    value={showEditVariantModal.stock}
                    onChange={e => setShowEditVariantModal({ ...showEditVariantModal, stock: Number(e.target.value) })}
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">SKU</label>
                  <input
                    type="text"
                    value={showEditVariantModal.sku || ''}
                    onChange={e => setShowEditVariantModal({ ...showEditVariantModal, sku: e.target.value })}
                    className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleDeleteVariant(showEditVariantModal.id)}
                  className="flex-1 py-3 bg-error-container text-on-error-container hover:bg-error hover:text-white font-headline-sm text-headline-sm font-bold uppercase tracking-tight transition-all shadow-md"
                >
                  ELIMINAR
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 bg-primary-container text-on-primary-container hover:bg-white hover:text-surface font-headline-sm text-headline-sm font-bold uppercase tracking-tight transition-all shadow-md"
                >
                  GUARDAR CAMBIOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
