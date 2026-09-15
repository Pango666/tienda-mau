import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../services/catalogService'
import type { ProductWithDetails, Category } from '../../../types'
import ProductCard from '../components/ProductCard'
import Toast, { useToast } from '../../../shared/Toast'

export default function CatalogPage() {
  const location = useLocation()
  
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    new URLSearchParams(location.search).get('categoria')
  )
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  
  const [gridCols, setGridCols] = useState<3 | 4>(3)
  const [priceMax, setPriceMax] = useState(500)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    fetchProducts().then(data => setProducts(data))
    fetchCategories().then(data => setCategories(data))
  }, [])
  
  // Also update selectedCategory if URL changes (e.g. going back)
  useEffect(() => {
    setSelectedCategory(new URLSearchParams(location.search).get('categoria'))
  }, [location.search])
  
  const targetCategoryId = selectedCategory ? categories.find(c => c.slug === selectedCategory)?.id : null;

  const productsInCategory = products.filter(p => {
    if (selectedCategory && p.category_id !== targetCategoryId) return false;
    return true;
  });

  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.category_id !== targetCategoryId) return false;
    if (p.base_price > priceMax) return false;
    
    if (selectedColor) {
      const hasColor = p.product_variants?.some(v => v.color.trim().toLowerCase() === selectedColor.toLowerCase())
      if (!hasColor) return false;
    }
    
    if (selectedSize) {
      const hasSize = p.product_variants?.some(v => v.size.trim().toLowerCase() === selectedSize.toLowerCase())
      if (!hasSize) return false;
    }
    
    return true;
  })

  // Dynamic filter options based on products in the current category
  const availableSizes = Array.from(new Set(
    productsInCategory.flatMap(p => p.product_variants?.map(v => v.size.trim().toUpperCase()) || [])
  )).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  })

  const availableColors = Array.from(new Set(
    productsInCategory.flatMap(p => p.product_variants?.map(v => v.color.trim().toUpperCase()) || [])
  )).sort()

  const numericSizes = availableSizes.filter(s => !isNaN(Number(s)))
  const letterSizes = availableSizes.filter(s => isNaN(Number(s)))

  const colorMap: Record<string, string> = {
    'NEGRO': 'bg-black',
    'BLANCO': 'bg-white',
    'NARANJA': 'bg-[#FF5625]',
    'VERDE': 'bg-[#4a5320]',
    'GRIS': 'bg-secondary-container',
    'AZUL': 'bg-[#0047ff]',
    'ROJO': 'bg-red-600',
    'BEIGE': 'bg-[#EBE7DD]',
    'CAFE': 'bg-[#5c4033]',
  }

  return (
    <>
      {/* Header */}
      <section className="w-full bg-surface-container-lowest py-8 px-4 md:px-margin-tablet lg:px-margin-desktop">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary-container"></span>
              <span className="font-label-mono text-label-mono text-primary uppercase">PROTOCOLO CATÁLOGO // SISTEMA 04</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface uppercase tracking-tight">ARCHIVO DE PRENDAS</h1>
          </div>
          <div className="flex items-center gap-3 bg-surface-container px-3 py-2">
            <span className="material-symbols-outlined text-primary text-sm">inventory_2</span>
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">STOCK DISPONIBLE // TEMPORADA FW25</span>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="w-full bg-surface-container-low px-4 md:px-margin-tablet lg:px-margin-desktop py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-label-mono text-label-mono text-primary font-bold">[ {products.length} PRENDAS ENCONTRADAS ]</span>
            <span className="hidden sm:inline text-secondary-container font-label-mono text-xs">/</span>
            <span className="hidden sm:inline font-label-mono text-label-mono text-on-surface-variant">COLECCIÓN LIMITADA ACTIVA</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="font-label-mono text-label-mono text-on-surface-variant uppercase" htmlFor="sort-select">ORDEN:</label>
              <div className="relative">
                <select className="appearance-none bg-surface-container text-on-surface font-label-mono text-label-mono px-3 py-1.5 pr-8 uppercase cursor-pointer focus:outline-none" id="sort-select">
                  <option value="populares">Más Populares</option>
                  <option value="precio-asc">Precio: Menor a Mayor</option>
                  <option value="precio-desc">Precio: Mayor a Menor</option>
                  <option value="novedades">Novedades FW25</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-on-surface-variant">expand_more</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-1 bg-surface-container p-0.5">
              <button
                aria-label="Cuadrícula 3x3"
                className={`px-2 py-1 transition-colors flex items-center justify-center ${gridCols === 3 ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setGridCols(3)}
                type="button"
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
              </button>
              <button
                aria-label="Cuadrícula 4x4"
                className={`px-2 py-1 transition-colors flex items-center justify-center ${gridCols === 4 ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setGridCols(4)}
                type="button"
              >
                <span className="material-symbols-outlined text-sm">view_comfy</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-6 bg-surface-container-lowest p-5">
            <div className="flex items-center justify-between pb-3 bg-surface-container px-3 py-2">
              <span className="font-label-mono text-label-mono text-on-surface uppercase font-bold tracking-wider">// FILTROS AVANZADOS</span>
              <button 
                className="font-label-mono text-[10px] text-primary hover:underline uppercase" 
                type="button"
                onClick={() => {
                  setSelectedCategory(null)
                  setPriceMax(500)
                  setSelectedColor(null)
                  setSelectedSize(null)
                }}
              >
                LIMPIAR TODO
              </button>
            </div>

            {/* Cap Type */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">TIPO DE PRENDA</span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">SILUETA</span>
              </div>
              <div className="flex flex-col gap-2 font-label-mono text-body-sm">
                <label className="flex items-center justify-between cursor-pointer group bg-surface-container/50 hover:bg-surface-container px-2 py-1.5 transition-colors">
                  <span className="flex items-center gap-2">
                    <input 
                      className="w-4 h-4 rounded-none accent-primary-container bg-surface-container cursor-pointer" 
                      type="radio" 
                      name="category"
                      checked={selectedCategory === null} 
                      onChange={() => setSelectedCategory(null)}
                    />
                    <span className="text-on-surface group-hover:text-primary transition-colors">TODAS</span>
                  </span>
                </label>
                {categories.map((cat) => {
                  const formattedName = cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase();
                  return (
                    <label key={cat.id} className="flex items-center justify-between cursor-pointer group bg-surface-container/50 hover:bg-surface-container px-2 py-1.5 transition-colors">
                      <span className="flex items-center gap-2">
                        <input 
                          className="w-4 h-4 rounded-none accent-primary-container bg-surface-container cursor-pointer" 
                          type="radio" 
                          name="category"
                          checked={selectedCategory === cat.slug}
                          onChange={() => setSelectedCategory(cat.slug)}
                        />
                        <span className="text-on-surface group-hover:text-primary transition-colors">{formattedName}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Color */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">COLOR SPECTRUM</span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">TODOS</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableColors.map(colorName => {
                  const bgClass = colorMap[colorName] || 'bg-surface-container-highest'
                  return (
                    <button 
                      key={colorName} 
                      className={`group p-2 bg-surface-container flex flex-col items-center justify-center gap-1.5 hover:bg-surface-bright transition-colors text-center ${selectedColor === colorName ? 'ring-2 ring-primary' : ''}`} 
                      type="button"
                      onClick={() => setSelectedColor(selectedColor === colorName ? null : colorName)}
                    >
                      <span className={`w-5 h-5 rounded-full ${bgClass} shadow-sm border border-outline-variant/30`}></span>
                      <span className={`font-label-mono text-[9px] break-all ${selectedColor === colorName ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{colorName}</span>
                    </button>
                  )
                })}
                {availableColors.length === 0 && (
                  <span className="font-label-mono text-[10px] text-on-surface-variant col-span-3">No hay colores disponibles</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">RANGO DE PRECIO</span>
                <span className="font-label-mono text-label-mono text-primary font-bold">Bs. {50} - Bs. {priceMax}</span>
              </div>
              <div className="flex flex-col gap-2">
                <input className="w-full accent-primary-container bg-surface-container h-1 cursor-pointer" max="500" min="50" step="10" type="range" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} />
                <div className="flex justify-between font-label-mono text-[10px] text-on-surface-variant">
                  <span>MIN: Bs.50</span>
                  <span>MED: Bs.250</span>
                  <span>MAX: Bs.500</span>
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="flex flex-col gap-5">
              {numericSizes.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">TALLA (CALZADO)</span>
                    <span className="font-label-mono text-[10px] text-on-surface-variant">EU</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 font-label-mono text-body-sm">
                    {numericSizes.map((size) => (
                      <button 
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                        className={`flex items-center justify-center p-2 text-[11px] font-bold transition-colors border ${selectedSize === size ? 'border-primary bg-primary-container text-on-primary-container' : 'border-surface-container-high bg-surface-container/50 hover:bg-surface-container text-on-surface'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {letterSizes.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">TALLA (PRENDAS)</span>
                    <span className="font-label-mono text-[10px] text-on-surface-variant">LETRAS</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 font-label-mono text-body-sm">
                    {letterSizes.map((size) => (
                      <button 
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                        className={`flex items-center justify-center p-2 text-[11px] font-bold transition-colors border ${selectedSize === size ? 'border-primary bg-primary-container text-on-primary-container' : 'border-surface-container-high bg-surface-container/50 hover:bg-surface-container text-on-surface'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableSizes.length === 0 && (
                <div className="flex flex-col gap-3">
                  <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">TALLA</span>
                  <span className="font-label-mono text-[10px] text-on-surface-variant">No hay tallas disponibles</span>
                </div>
              )}
            </div>

            {/* Delivery badge */}
            <div className="p-3 bg-surface-container flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">ENTREGA RÁPIDA</span>
                <span className="font-headline-sm text-xs uppercase font-bold text-on-surface">PUNTOS DROP-OFF</span>
              </div>
              <span className="material-symbols-outlined text-primary text-lg">local_shipping</span>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-9 flex flex-col gap-8">
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 transition-all duration-300`}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickAdd={(title) => showToast(title)}
                />
              ))}
            </div>

            {/* Load more */}
            <div className="flex flex-col items-center justify-center gap-4 pt-8 pb-4">
              <div className="w-full flex items-center gap-4">
                <div className="flex-1 h-px bg-surface-container-highest"></div>
                <span className="font-label-mono text-[11px] text-on-surface-variant uppercase">
                  MOSTRANDO {filteredProducts.length} DE {products.length} MODELOS
                </span>
                <div className="flex-1 h-px bg-surface-container-highest"></div>
              </div>
              <div className="flex items-center gap-2 font-label-mono text-[10px] text-on-surface-variant">
                <span>DROP ACTIVO PROTOCOLO FW25</span>
                <span>//</span>
                <span>DISPONIBILIDAD INMEDIATA EN PUNTOS DE ENTREGA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast.message} isVisible={toast.isVisible} onHide={hideToast} />
    </>
  )
}
