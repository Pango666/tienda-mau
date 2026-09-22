import { useState, useEffect } from 'react'
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
]

export default function Navbar() {
  const location = useLocation()
  const { totalItems } = useCartContext()
  const itemCount = totalItems()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  return (
    <header className="sticky top-0 z-[100] w-full bg-surface/95 backdrop-blur-md border-b border-outline-variant/30">
      <div className="h-16 md:h-20 w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
        
        {/* Hamburger Menu (Mobile) */}
        <div className="flex xl:hidden flex-1 justify-start">
          <button
            className="p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors z-50"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir Menú"
          >
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex flex-1 justify-center xl:justify-start shrink-0 z-50">
          <Link to="/" className="flex items-center shrink-0">
            <img alt="Wanted Lodge Logo" className="h-[40px] md:h-[70px] w-auto object-contain drop-shadow-md" src={LOGO_URL} />
          </Link>
        </div>

        {/* Nav Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 border-x border-outline-variant/30 px-3 h-full mx-6">
          {NAV_LINKS.map(link => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={
                  isActive
                    ? 'px-4 py-2 transition-colors uppercase bg-surface-container-high text-primary border-primary-container font-bold font-label-caps text-label-caps tracking-wider'
                    : 'font-label-caps text-label-caps px-4 py-2 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors uppercase tracking-wider'
                }
                {...(isActive ? { 'aria-current': 'page' as const } : {})}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex flex-1 justify-end items-center gap-1 md:gap-3">
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
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20 hidden sm:block"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>

          {/* Cart */}
          <Link
            to="/checkout"
            aria-label="Shopping Cart"
            className="relative p-2 text-on-surface hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <span className="bg-primary text-white font-label-mono text-[10px] font-bold px-1.5 py-0.5 leading-none">
              {itemCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[105] bg-surface/50 backdrop-blur-sm xl:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-y-0 left-0 z-[110] w-[85%] max-w-sm bg-white shadow-2xl flex flex-col pt-6 px-4 pb-6 xl:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8 px-2">
          <img alt="Wanted Lodge Logo" className="h-[35px] w-auto object-contain" src={LOGO_URL} />
          <button
            className="p-2 -mr-2 text-on-surface-variant hover:text-primary transition-colors bg-surface-container rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Menu"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        
        <nav className="flex flex-col gap-2 w-full">
          {NAV_LINKS.map(link => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={
                  isActive
                    ? 'px-4 py-4 uppercase bg-surface-container-high text-primary border-l-4 border-primary font-bold font-label-caps text-lg tracking-widest'
                    : 'font-label-caps text-lg tracking-widest px-4 py-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors uppercase'
                }
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant/30 px-2 flex flex-col gap-4">
           <div className="flex items-center gap-3 bg-surface-container px-3 py-2 w-fit">
            <span className="material-symbols-outlined text-primary text-sm">inventory_2</span>
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">SEASON FW25</span>
          </div>
        </div>
      </div>
    </header>
  )
}
