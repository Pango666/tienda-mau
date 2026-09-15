import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../services/catalogService'
import type { ProductWithDetails, Category } from '../../../types'
import ProductCard from '../components/ProductCard'
import Toast, { useToast } from '../../../shared/Toast'

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const { toast, showToast, hideToast } = useToast()
  
  const latestProduct = products.length > 0 ? products[0] : null
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchProducts().then(data => setProducts(data.slice(0, 5)))
    fetchCategories().then(data => setCategories(data))
  }, [])

  return (
    <>
      {/* Ticker */}
      <div className="w-full bg-surface-container-lowest overflow-hidden py-2.5 shadow-sm select-none">
        <div className="flex whitespace-nowrap animate-marquee gap-8 font-label-mono text-label-mono uppercase text-secondary">
          <span className="inline-flex items-center gap-2"><span className="w-2 h-2 bg-primary-container inline-block"></span> NUEVA COLECCIÓN // EDICIÓN LIMITADA</span>
          <span>•</span>
          <span className="text-on-surface">PRENDAS DE ALTA CALIDAD Y DISEÑO</span>
          <span>•</span>
          <span className="inline-flex items-center gap-2 text-primary"><span className="material-symbols-outlined text-[14px]">local_shipping</span> ENVÍO GRATIS NACIONAL &gt; Bs. 450</span>
          <span>•</span>
          <span>OVERKAP CRAFT DIVISION // LA PAZ • COCHABAMBA • SANTA CRUZ</span>
          <span>•</span>
          <span className="inline-flex items-center gap-2"><span className="w-2 h-2 bg-primary-container inline-block"></span> EDICIÓN NUMERADA 01/300</span>
          <span>•</span>
          <span>NUEVA COLECCIÓN // EDICIÓN LIMITADA</span>
          <span>•</span>
          <span className="text-on-surface">PRENDAS DE ALTA CALIDAD Y DISEÑO</span>
          <span>•</span>
          <span className="text-primary">ENVÍO GRATIS NACIONAL &gt; Bs. 450</span>
          <span>•</span>
          <span>OVERKAP CRAFT DIVISION</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center gap-8 bg-surface-container-low p-6 md:p-10 lg:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute right-4 top-4 font-label-mono text-[90px] text-surface-container-highest/20 font-black leading-none select-none pointer-events-none -z-0">01</div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-surface-container-highest px-3 py-1 text-on-surface-variant font-label-mono text-label-mono mb-6">
                <span className="w-2 h-2 bg-primary-container animate-pulse"></span>
                <span>NUEVO LANZAMIENTO // ITEM RECIENTE</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-extrabold text-on-surface tracking-tighter uppercase mb-4 leading-none">
                {latestProduct ? latestProduct.title : 'CARGANDO...'}
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-xl mb-8 line-clamp-3">
                {latestProduct ? latestProduct.description : 'Buscando la prenda más reciente en la base de datos...'}
              </p>
              <div className="grid grid-cols-3 gap-3 mb-10 max-w-lg">
                <div className="bg-surface-container p-3">
                  <span className="block font-label-mono text-label-mono text-outline uppercase">MATERIAL</span>
                  <span className="font-headline-sm text-[11px] font-bold text-on-surface truncate block mt-1" title={latestProduct?.material || ''}>
                    {latestProduct?.material || '...'}
                  </span>
                </div>
                <div className="bg-surface-container p-3">
                  <span className="block font-label-mono text-label-mono text-outline uppercase">PRECIO</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1 block">
                    {latestProduct ? `Bs. ${latestProduct.base_price}` : '...'}
                  </span>
                </div>
                <div className="bg-surface-container p-3">
                  <span className="block font-label-mono text-label-mono text-outline uppercase">STATUS</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-primary flex items-center gap-1 mt-1">DISPONIBLE</span>
                </div>
              </div>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to={latestProduct ? `/producto/${latestProduct.id}` : '#'}
                className={`bg-primary-container hover:bg-on-surface hover:text-surface text-on-primary-container font-headline-sm text-headline-sm px-8 py-4 uppercase font-bold tracking-tight text-center transition-colors shadow-md flex items-center justify-center gap-3 group ${!latestProduct ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <span>VER PRODUCTO</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative bg-surface-container-lowest min-h-[480px] lg:min-h-full overflow-hidden shadow-xl group">
            {latestProduct?.product_images?.[0]?.image_url ? (
              <img
                alt={latestProduct.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
                src={latestProduct.product_images[0].image_url}
              />
            ) : (
              <div className="w-full h-full bg-surface-container-high animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-90 lg:opacity-75"></div>
            <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm p-3 max-w-[200px]">
              <span className="font-label-mono text-[9px] text-primary block">// {latestProduct?.category_id ? categories.find(c => c.id === latestProduct.category_id)?.name.toUpperCase() : 'NUEVO INGRESO'}</span>
              <span className="font-headline-sm text-body-md font-bold text-on-surface uppercase tracking-tight line-clamp-1">{latestProduct?.title || 'OVERKAP'}</span>
              <span className="font-label-mono text-[10px] text-secondary block mt-1">ÚLTIMO REGISTRO</span>
            </div>
            <div className="absolute bottom-4 right-4 bg-primary-container text-on-primary-container px-3 py-1 font-label-mono text-label-mono uppercase font-bold tracking-widest shadow-md">
              RECIÉN AÑADIDO
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: 'storefront', tag: '// CONFIANZA TOTAL', title: 'PUNTOS DE ENTREGA CÉNTRICOS', desc: 'Entregas personales directamente en tus manos. Nuestro personal acude al lugar acordado puntualmente.' },
            { icon: 'local_shipping', tag: '// COBERTURA NACIONAL', title: 'ENVÍOS NACIONALES', desc: 'Llegamos a todos los departamentos del país mediante Courier de confianza.' },
            { icon: 'qr_code_2', tag: '// FÁCIL Y SEGURO', title: 'PAGOS EFECTIVO QR', desc: 'Realiza tu pago en segundos sin tarjetas, transferencia directa vía QR simple.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-surface-container-low p-5 flex items-start gap-4 transition-colors hover:bg-surface-container">
              <div className="bg-surface-container-highest p-3 text-primary-container shrink-0">
                <span className="material-symbols-outlined text-headline-sm">{item.icon}</span>
              </div>
              <div>
                <span className="font-label-mono text-label-mono uppercase text-primary tracking-wider">{item.tag}</span>
                <h2 className="font-headline-sm text-body-lg font-bold text-on-surface mt-0.5 mb-1">{item.title}</h2>
                <p className="font-body-sm text-body-sm text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-12 lg:py-16" id="catalogo-seccion">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 bg-primary-container inline-block"></span>
              <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">// UNIDADES DE ALTA DEMANDA</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-md font-extrabold text-on-surface uppercase tracking-tight">
              LO MÁS VENDIDO
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-label-mono text-label-mono text-outline uppercase hidden sm:inline">
              [ MOSTRANDO {products.length > 0 ? `0${products.length}` : '00'} / 24 MODELOS ]
            </span>
            <Link
              to="/catalogo"
              className="bg-surface-container text-on-surface hover:bg-surface-container-high px-4 py-2 font-label-mono text-label-mono uppercase transition-colors flex items-center gap-1.5"
            >
              <span>VER TODO</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={(title) => showToast(title)}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-8 mb-6" id="categorias-seccion">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 bg-primary-container inline-block"></span>
              <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">// DEPARTAMENTOS</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-md font-extrabold text-on-surface uppercase tracking-tight">
              CATEGORÍAS
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              to={`/catalogo?categoria=${cat.slug}`}
              key={cat.id}
              className="group relative h-48 bg-surface-container overflow-hidden shadow-md flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-surface-container-high transition-transform group-hover:scale-105">
                {/* Fallback pattern if no category image exists */}
                <div className="w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent"></div>
              
              <div className="relative z-10 text-center p-4">
                <span className="font-label-mono text-[10px] text-primary block mb-1">
                  // 0{idx + 1}
                </span>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface uppercase tracking-wider group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-primary-container inline-block"></span>
            <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">// ÚLTIMOS INGRESOS</span>
          </div>
          <Link className="font-label-mono text-label-mono text-secondary hover:text-on-surface uppercase flex items-center gap-1 transition-colors" to="/catalogo">
            <span>VER CATÁLOGO COMPLETO</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(1, 5).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={(title) => showToast(title)}
            />
          ))}
        </div>
      </section>

      <Toast message={toast.message} isVisible={toast.isVisible} onHide={hideToast} />
    </>
  )
}
