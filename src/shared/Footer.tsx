import { Link } from 'react-router-dom'

import LOGO_URL from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-outline-variant/20">
          {/* Brand */}
          <div className="md:col-span-6 lg:col-span-6">
            <div className="flex items-center gap-2 mb-4">
              <img alt="Wanted Lodge Logo" className="h-16 w-auto object-contain" src={LOGO_URL} />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
              Apparel & Gear for the outdoors. Est. 2023. Gorras estructuradas y streetwear.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-label-mono text-label-mono uppercase text-primary mb-4 tracking-widest">
              // NAVEGACIÓN
            </h4>
            <ul className="space-y-2 font-label-mono text-body-sm text-on-surface-variant">
              <li><Link to="/" className="hover:text-on-surface cursor-pointer">INICIO</Link></li>
              <li><Link to="/catalogo" className="hover:text-on-surface cursor-pointer">CATÁLOGO COMPLETO</Link></li>
              <li><Link to="/puntos-de-entrega" className="hover:text-on-surface cursor-pointer">PUNTOS DROP-OFF</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-label-mono text-label-mono uppercase text-primary mb-4 tracking-widest">
              // SOPORTE
            </h4>
            <ul className="space-y-2 font-label-mono text-body-sm text-on-surface-variant">
              
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-label-mono text-[11px] text-outline">
          <div className="flex items-center gap-3">
            <span>© 2025 WANTED LODGE FOR APPAREL & GEAR. ALL RIGHTS RESERVED.</span>
            <span className="hidden md:inline">//</span>
            <span className="uppercase">FABRICADO PARA EL PAVIMENTO</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <a className="hover:text-on-surface transition-colors uppercase" href="#">INSTAGRAM</a>
            <a className="hover:text-on-surface transition-colors uppercase" href="#">TIKTOK</a>
            <a className="hover:text-on-surface transition-colors uppercase" href="#">FACEBOOK</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
