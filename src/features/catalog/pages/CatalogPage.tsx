import { useState, useEffect } from 'react'
import { fetchProducts } from '../services/catalogService'
import type { ProductWithDetails } from '../../../types'
import ProductCard from '../components/ProductCard'
import Toast, { useToast } from '../../../shared/Toast'

export default function CatalogPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [gridCols, setGridCols] = useState<3 | 4>(3)
  const [priceMax, setPriceMax] = useState(75)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    fetchProducts().then(data => setProducts(data))
  }, [])

  return (
    <>
      {/* Header */}
      <section className="w-full bg-surface-container-lowest py-8 px-4 md:px-margin-tablet lg:px-margin-desktop">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary-container"></span>
              <span className="font-label-mono text-label-mono text-primary uppercase">CATALOG PROTOCOL // SYSTEM 04</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface uppercase tracking-tight">HEADWEAR ARCHIVE</h1>
          </div>
          <div className="flex items-center gap-3 bg-surface-container px-3 py-2">
            <span className="material-symbols-outlined text-primary-container text-sm">inventory_2</span>
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">STOCK DISPONIBLE // TEMPORADA FW25</span>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="w-full bg-surface-container-low px-4 md:px-margin-tablet lg:px-margin-desktop py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-label-mono text-label-mono text-primary font-bold">[ {products.length} GORRAS ENCONTRADAS ]</span>
            <span className="hidden sm:inline text-secondary-container font-label-mono text-xs">/</span>
            <span className="hidden sm:inline font-label-mono text-label-mono text-on-surface-variant">DROP LIMITADO ACTIVO</span>
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
              <button className="font-label-mono text-[10px] text-primary hover:underline uppercase" type="button">LIMPIAR TODO</button>
            </div>

            {/* Cap Type */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">TIPO DE GORRA</span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">SILUETA</span>
              </div>
              <div className="flex flex-col gap-2 font-label-mono text-body-sm">
                {['Snapback', 'Trucker', 'Dad Hat', 'Visera Plana', 'Camp Cap'].map((type, idx) => (
                  <label key={type} className="flex items-center justify-between cursor-pointer group bg-surface-container/50 hover:bg-surface-container px-2 py-1.5 transition-colors">
                    <span className="flex items-center gap-2">
                      <input className="w-4 h-4 rounded-none accent-primary-container bg-surface-container cursor-pointer" type="checkbox" defaultChecked={idx === 0} />
                      <span className="text-on-surface group-hover:text-primary transition-colors">{type}</span>
                    </span>
                    <span className="text-on-surface-variant text-[11px] font-mono">[{String(8 - idx).padStart(2, '0')}]</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">COLOR SPECTRUM</span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">ALL</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'BLACK', bg: 'bg-black' },
                  { name: 'WHITE', bg: 'bg-white' },
                  { name: 'ORANGE', bg: 'bg-primary-container' },
                  { name: 'OLIVE', bg: 'bg-[#4a5320]' },
                  { name: 'GRAY', bg: 'bg-secondary-container' },
                  { name: 'BLUE', bg: 'bg-[#0047ff]' },
                ].map(color => (
                  <button key={color.name} className="group p-2 bg-surface-container flex flex-col items-center gap-1.5 hover:bg-surface-bright transition-colors text-left" type="button">
                    <span className={`w-5 h-5 rounded-full ${color.bg} shadow-sm`}></span>
                    <span className="font-label-mono text-[10px] text-on-surface-variant group-hover:text-on-surface">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">RANGO DE PRECIO</span>
                <span className="font-label-mono text-label-mono text-primary font-bold">${35} - ${priceMax} USD</span>
              </div>
              <div className="flex flex-col gap-2">
                <input className="w-full accent-primary-container bg-surface-container h-1 cursor-pointer" max="75" min="35" step="5" type="range" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} />
                <div className="flex justify-between font-label-mono text-[10px] text-on-surface-variant">
                  <span>MIN: $35</span>
                  <span>MED: $55</span>
                  <span>MAX: $75</span>
                </div>
              </div>
            </div>

            {/* Collection */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-xs uppercase font-bold text-on-surface tracking-wider">COLECCIÓN / DROP</span>
                <span className="font-label-mono text-[10px] text-primary-container animate-pulse">● LIVE</span>
              </div>
              <div className="flex flex-col gap-2 font-label-mono text-body-sm">
                {[
                  { name: 'Fall/Winter 25', tag: 'NEW', tagClass: 'text-primary-container' },
                  { name: 'Nocturnal Core', tag: 'CORE', tagClass: 'text-on-surface-variant' },
                  { name: 'Archive Re-issue', tag: 'ARCH', tagClass: 'text-on-surface-variant' },
                ].map((col, idx) => (
                  <label key={col.name} className="flex items-center justify-between cursor-pointer group bg-surface-container/50 hover:bg-surface-container px-2 py-1.5 transition-colors">
                    <span className="flex items-center gap-2">
                      <input className="accent-primary-container cursor-pointer" name="collection" type="radio" defaultChecked={idx === 0} />
                      <span className="text-on-surface group-hover:text-primary transition-colors">{col.name}</span>
                    </span>
                    <span className={`text-[10px] font-mono ${col.tagClass}`}>{col.tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery badge */}
            <div className="p-3 bg-surface-container flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">ENTREGA RÁPIDA</span>
                <span className="font-headline-sm text-xs uppercase font-bold text-on-surface">PUNTOS DROP-OFF</span>
              </div>
              <span className="material-symbols-outlined text-primary-container text-lg">local_shipping</span>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-9 flex flex-col gap-8">
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 transition-all duration-300`}>
              {products.map(product => (
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
                  MOSTRANDO {products.length} DE {products.length} MODELOS
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
