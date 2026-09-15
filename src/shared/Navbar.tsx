import { Link, useLocation } from 'react-router-dom'
import { useCartContext } from '../features/cart/context/CartContext'

import LOGO_URL from '../assets/logo.png'
interface NavLink {
  path: string
  label: string
}

const NAV_LINKS: NavLink[] = [
  { path: '/', label: 'INICIO' },
  { path: '/catalogo', label: 'CATÁLOGO' },
  { path: '/puntos-de-entrega', label: 'PUNTOS DE ENTREGA' },
  { path: '/faq-contacto', label: 'FAQ & CONTACTO' },
]

export default function Navbar() {
  const location = useLocation()
  const { totalItems } = useCartContext()
  const itemCount = totalItems()

  return (
    <header className="w-full bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30">
      <div className="h-20 w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="flex items-center gap-3 relative z-10 shrink-0">
            <img alt="Wanted Lodge Logo" className="h-16 w-auto object-contain" src={LOGO_URL} />
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 border-x border-outline-variant/30 px-3 h-full">
          {NAV_LINKS.map(link => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={
                  isActive
                    ? 'px-3 py-2 transition-colors uppercase bg-surface-container-high text-primary border-primary-container font-bold font-label-caps text-label-caps'
                    : 'font-label-caps text-label-caps px-3 py-2 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors uppercase'
                }
                {...(isActive ? { 'aria-current': 'page' as const } : {})}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center bg-surface-container px-3 py-1.5 border border-outline-variant/40 focus-within:border-primary-container transition-all">
            <span className="material-symbols-outlined text-outline text-sm mr-2">search</span>
            <input
              className="bg-transparent border-0 outline-none text-body-sm font-label-mono text-on-surface placeholder:text-on-surface-variant/70 w-44 lg:w-56"
              placeholder="BUSCAR PIEZAS, DROPS..."
              type="text"
            />
            <kbd className="ml-2 font-label-mono text-[10px] px-1.5 py-0.5 bg-surface-container-high text-outline border border-outline-variant/30">
              ⌘K
            </kbd>
          </div>

          {/* Wishlist */}
          <button
            aria-label="Wishlist"
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>

          {/* Cart */}
          <Link
            to="/checkout"
            aria-label="Shopping Cart"
            className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <span className="bg-primary-container text-on-primary-container font-label-mono text-[10px] font-bold px-1.5 py-0.5 leading-none">
              {itemCount}
            </span>
          </Link>

        </div>
      </div>
    </header>
  )
}
