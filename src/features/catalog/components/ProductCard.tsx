import { Link } from 'react-router-dom'
import type { ProductWithDetails } from '../../../types'

interface ProductCardProps {
  product: ProductWithDetails
  onQuickAdd?: (productTitle: string) => void
}

export default function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const mainImage = product.product_images?.[0]?.image_url || ''
  const colors = product.product_variants
    ? [...new Set(product.product_variants.map(v => v.color))]
    : []
  const totalStock = product.product_variants
    ? product.product_variants.reduce((sum, v) => sum + v.stock, 0)
    : 0

  return (
    <article className="group relative flex flex-col bg-surface-container-lowest overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/producto/${product.id}`} className="relative w-full aspect-square bg-surface-container-high overflow-hidden block">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={mainImage}
          alt={product.title}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="bg-surface-container-lowest text-primary font-label-mono text-[10px] px-2 py-0.5 uppercase tracking-widest font-bold">
            GORRA
          </span>
          {totalStock <= 5 && totalStock > 0 && (
            <span className="bg-primary-container text-on-primary-container font-label-mono text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
              LIMITED
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-2 bg-surface-container">
        <div className="flex items-center justify-between">
          <span className="font-label-mono text-[10px] text-on-surface-variant">
            SERIAL: #OKP-{product.id.slice(0, 3).toUpperCase()}
          </span>
          <div className="flex items-center gap-1.5">
            {colors.slice(0, 3).map((color, idx) => (
              <span
                key={idx}
                className="w-2 h-2 rounded-full border border-outline-variant/40"
                style={{ backgroundColor: color.toLowerCase() === 'negro' || color.toLowerCase() === 'black' ? '#000' : color.toLowerCase() === 'blanco' || color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'naranja' || color.toLowerCase() === 'orange' ? '#ff5625' : '#454747' }}
              />
            ))}
          </div>
        </div>
        <h2 className="font-headline-sm text-base uppercase text-on-surface group-hover:text-primary transition-colors truncate">
          {product.title}
        </h2>
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-label-mono text-sm font-bold text-on-surface">
            ${product.base_price.toFixed(2)} USD
          </span>
          <span className={`font-label-mono text-[10px] ${totalStock <= 5 ? 'text-primary-container' : 'text-on-surface-variant'}`}>
            {totalStock <= 0 ? 'AGOTADO' : totalStock <= 5 ? `${totalStock} UNIDADES` : 'EN STOCK'}
          </span>
        </div>
      </div>

      {/* Quick add button */}
      {onQuickAdd && totalStock > 0 && (
        <button
          aria-label={`Añadir ${product.title} al carrito`}
          className="absolute bottom-[88px] right-3 w-10 h-10 bg-primary-container hover:bg-surface-bright text-on-primary-container hover:text-on-surface flex items-center justify-center shadow-lg transition-transform active:scale-95"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onQuickAdd(product.title)
          }}
        >
          <span className="material-symbols-outlined text-base">add_shopping_cart</span>
        </button>
      )}
    </article>
  )
}
