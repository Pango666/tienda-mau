import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../services/catalogService'
import type { ProductWithDetails, ProductVariant } from '../../../types'
import { useCartContext } from '../../cart/context/CartContext'
import Toast, { useToast } from '../../../shared/Toast'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const { addItem } = useCartContext()
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    if (id) {
      setLoading(true)
      fetchProductById(id).then(data => {
        setProduct(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 py-20 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">autorenew</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 py-20 text-center">
        <h1 className="font-headline-lg text-headline-md text-on-surface uppercase">PRODUCTO NO ENCONTRADO</h1>
      </div>
    )
  }

  const images = product.product_images || []
  const variants = product.product_variants || []
  const colors = [...new Set(variants.map(v => v.color))]
  const sizes = [...new Set(variants.map(v => v.size))]

  // Find the matching variant
  const selectedVariant: ProductVariant | undefined = variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  )

  const canAddToCart = !!(selectedColor && selectedSize && selectedVariant && selectedVariant.stock > 0)
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
  const mainImage = images[activeImageIndex]?.image_url || images[0]?.image_url || ''

  function handleAddToCart() {
    if (!canAddToCart || !selectedVariant || !product) return

    setIsAdding(true)
    setTimeout(() => {
      addItem({
        variant_id: selectedVariant.id,
        title: product.title,
        size: selectedSize!,
        color: selectedColor!,
        quantity,
        price: product.base_price,
        image: images[0]?.image_url || '',
      })
      showToast(product.title)
      setIsAdding(false)
    }, 750)
  }

  const total = (quantity * product.base_price).toFixed(2)

  return (
    <>
      {/* Spec Ticker */}
      <div className="w-full bg-surface-container-low px-4 md:px-margin-tablet lg:px-margin-desktop py-2.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-primary-container animate-ping"></span>
            <span className="font-label-mono text-label-mono text-primary-fixed uppercase tracking-wider">DROP REGISTRY // BATCH #{id?.slice(0, 4).toUpperCase()}</span>
            <span className="text-tertiary-container font-label-mono text-label-mono">//</span>
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">SERIALIZED STOCK ACTIVE</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-label-mono text-label-mono text-primary uppercase">[ 100% HEAVY CANVAS ]</span>
          </div>
        </div>
      </div>

      {/* Main Product Detail */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-gutter-desktop items-start">
          {/* Left: Images */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative w-full aspect-[4/5] bg-surface-container-lowest overflow-hidden group">
              <img
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 select-none"
                src={mainImage}
                alt={product.title}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <div className="bg-primary-container text-on-primary-container px-3 py-1 font-label-mono text-label-mono font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 bg-on-primary-container"></span>
                  {totalStock > 0 ? 'IN STOCK // GLOBAL' : 'AGOTADO'}
                </div>
                <div className="bg-surface-container-highest text-on-surface px-2.5 py-1 font-label-mono text-[10px] uppercase tracking-wider backdrop-blur-md">
                  SYS VER 2.4 / FW25
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.slice(0, 3).map((img, idx) => (
                  <button
                    key={img.id}
                    className={`group relative aspect-square bg-surface-container-lowest overflow-hidden transition-all text-left ${
                      activeImageIndex === idx ? 'bg-surface-container-high ring-2 ring-primary-container' : ''
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                    type="button"
                  >
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={img.image_url} alt={`Vista ${idx + 1}`} />
                    <div className="absolute bottom-1 left-1.5 bg-surface-container-lowest/85 px-1.5 py-0.5 font-label-mono text-[9px] text-on-surface uppercase">
                      VISTA {idx + 1}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Purchase Terminal */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-surface-container-low p-6 md:p-8 flex flex-col gap-6">
              {/* Breadcrumbs */}
              <div className="flex items-center justify-between gap-2">
                <nav className="flex items-center gap-1.5 font-label-mono text-[11px] text-tertiary uppercase tracking-wider flex-wrap">
                  <Link to="/" className="hover:text-primary transition-colors">INICIO</Link>
                  <span>/</span>
                  <Link to="/catalogo" className="hover:text-primary transition-colors">GORRAS</Link>
                  <span>/</span>
                  <span className="text-on-surface">{product.title}</span>
                </nav>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1 -mt-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">// DROP EXCLUSIVO ARCHIVO 2025</span>
                </div>
                <h1 className="font-headline-md text-headline-md md:text-5xl font-extrabold uppercase text-on-surface tracking-tighter leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Price */}
              <div className="bg-surface-container p-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="font-headline-md text-headline-md md:text-4xl font-extrabold text-on-surface tracking-tight">Bs. {product.base_price.toFixed(2)}</span>
                  <span className="font-label-mono text-body-sm text-tertiary uppercase">BOB</span>
                </div>
              </div>

              {/* Color Selector */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">01 // TONO SELECCIONADO:</span>
                  <span className="font-label-mono text-label-mono text-primary font-bold uppercase tracking-wider">
                    {selectedColor || 'NINGUNO'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`p-3 bg-surface-container hover:bg-surface-container-high flex flex-col items-center gap-2 transition-all ${
                        selectedColor === color ? 'bg-surface-container-highest ring-2 ring-primary-container' : ''
                      }`}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                    >
                      <div
                        className="w-6 h-6 shadow-sm"
                        style={{ backgroundColor: color.toLowerCase() === 'negro' || color.toLowerCase() === 'black' ? '#0c0c0c' : color.toLowerCase() === 'blanco' || color.toLowerCase() === 'white' ? '#d9d9d6' : color.toLowerCase() === 'naranja' || color.toLowerCase() === 'orange' ? '#ff5625' : '#4e5052' }}
                      ></div>
                      <span className={`font-label-mono text-[10px] uppercase tracking-tight ${selectedColor === color ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {color.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">02 // TALLA:</span>
                  <button
                    className="font-label-mono text-[11px] text-primary hover:underline uppercase flex items-center gap-1"
                    onClick={() => setShowSizeModal(true)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">straighten</span> GUÍA CRANEAL
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => {
                    const sizeVariants = variants.filter(v => v.size === size && (!selectedColor || v.color === selectedColor))
                    const inStock = sizeVariants.some(v => v.stock > 0)
                    return (
                      <button
                        key={size}
                        disabled={!inStock}
                        className={`p-3 bg-surface-container flex flex-col items-center gap-1 transition-all ${
                          selectedSize === size ? 'bg-surface-container-highest ring-2 ring-primary-container' : ''
                        } ${!inStock ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-container-high'}`}
                        onClick={() => inStock && setSelectedSize(size)}
                        type="button"
                      >
                        <span className="font-headline-sm text-body-md font-bold text-on-surface">{size}</span>
                        <span className="font-label-mono text-[10px] text-outline uppercase">
                          {inStock ? 'DISPONIBLE' : 'AGOTADO'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">03 // UNIDADES:</span>
                  {selectedVariant && (
                    <div className="flex items-center gap-2 bg-surface-container px-2.5 py-1">
                      <span className="w-2 h-2 bg-primary-container animate-pulse"></span>
                      <span className="font-label-mono text-[11px] text-primary-container font-bold uppercase">
                        QUEDAN {selectedVariant.stock} UNIDADES
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-surface-container">
                    <button
                      className="w-12 h-12 flex items-center justify-center font-label-mono text-headline-sm text-on-surface hover:bg-surface-container-highest transition-colors"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      type="button"
                    >
                      -
                    </button>
                    <input
                      className="w-12 h-12 bg-transparent text-center font-label-mono text-body-lg font-bold text-on-surface select-none outline-none"
                      readOnly
                      type="text"
                      value={quantity}
                    />
                    <button
                      className="w-12 h-12 flex items-center justify-center font-label-mono text-headline-sm text-on-surface hover:bg-surface-container-highest transition-colors"
                      onClick={() => setQuantity(q => Math.min(selectedVariant?.stock || 8, q + 1))}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  className={`w-full py-4 px-6 font-headline-sm text-headline-sm font-extrabold uppercase tracking-tight transition-all duration-200 flex items-center justify-center gap-3 shadow-xl ${
                    canAddToCart
                      ? 'bg-primary-container hover:bg-surface-bright text-on-primary-container hover:text-on-surface hover:translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0'
                      : 'bg-surface-container-highest text-outline cursor-not-allowed'
                  }`}
                  disabled={!canAddToCart || isAdding}
                  onClick={handleAddToCart}
                  type="button"
                >
                  {isAdding ? (
                    <>
                      <span className="material-symbols-outlined text-2xl animate-spin">autorenew</span>
                      <span>PROCESANDO EN SISTEMA...</span>
                    </>
                  ) : !selectedColor || !selectedSize ? (
                    <>
                      <span className="material-symbols-outlined text-2xl">info</span>
                      <span>SELECCIONA COLOR Y TALLA</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-2xl font-bold">shopping_bag</span>
                      <span>AÑADIR AL CARRITO — Bs. {total}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center font-label-mono text-[10px] text-tertiary-fixed-dim">
                <div className="bg-surface-container p-2 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-sm mb-0.5 text-outline">local_shipping</span>
                  <span>ENVÍO EXPRESS</span>
                </div>
                <div className="bg-surface-container p-2 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-sm mb-0.5 text-outline">verified</span>
                  <span>AUTÉNTICO 100%</span>
                </div>
                <div className="bg-surface-container p-2 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-sm mb-0.5 text-outline">sync</span>
                  <span>RETORNO 14 DÍAS</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="flex flex-col gap-2 pt-4">
                {[
                  { id: 'materials', title: '// MATERIALES Y COMPOSICIÓN', content: 'Elaborada con sarga densa de alta tenacidad que previene deformaciones por humedad o fricción continua.' },
                  { id: 'care', title: '// GUÍA DE CUIDADOS & MANTENIMIENTO', content: 'Lavar únicamente a mano con paño húmedo y detergente neutro. No sumergir totalmente en agua.' },
                  { id: 'shipping', title: '// ENVÍOS Y RETIROS LOCALES', content: 'Envíos certificados a todo el país vía logística prioritaria. Empaque anti-aplastamiento.' },
                ].map(acc => (
                  <div key={acc.id} className="bg-surface-container overflow-hidden">
                    <button
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container-high transition-colors"
                      onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                      type="button"
                    >
                      <span className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">{acc.title}</span>
                      <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${openAccordion === acc.id ? 'rotate-180' : ''}`}>
                        {openAccordion === acc.id ? 'remove' : 'add'}
                      </span>
                    </button>
                    {openAccordion === acc.id && (
                      <div className="p-4 pt-0 text-body-sm text-on-surface-variant font-body-sm">
                        <p>{acc.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-high max-w-lg w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">// ESPECIFICACIONES CRANEALES</span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">GUÍA DE CALCE & MEDIDAS</h3>
              </div>
              <button className="p-2 bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors" onClick={() => setShowSizeModal(false)} type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              El modelo se adapta cómodamente a perímetros de cabeza desde 54 cm hasta 62 cm gracias a su tira de ajuste.
            </p>
            <div className="bg-surface-container p-4 space-y-3 font-label-mono text-label-mono">
              {[
                { label: 'AJUSTE MÍNIMO:', value: '54 CM' },
                { label: 'CALCE PROMEDIO:', value: '58 CM' },
                { label: 'AJUSTE MÁXIMO:', value: '62 CM' },
                { label: 'ALTURA DE CORONA:', value: '11.5 CM (HIGH CROWN)' },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between py-1.5 text-on-surface ${i < 3 ? 'border-b border-outline-variant/30' : ''}`}>
                  <span>{row.label}</span>
                  <span className="font-bold text-primary">{row.value}</span>
                </div>
              ))}
            </div>
            <button
              className="w-full py-3 bg-surface-container-lowest text-on-surface font-label-mono text-label-mono uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-colors font-bold"
              onClick={() => setShowSizeModal(false)}
              type="button"
            >
              ENTENDIDO // CONTINUAR COMPRA
            </button>
          </div>
        </div>
      )}

      <Toast message={toast.message} isVisible={toast.isVisible} onHide={hideToast} />
    </>
  )
}
