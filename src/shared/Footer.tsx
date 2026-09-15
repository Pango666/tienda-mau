import { Link } from 'react-router-dom'

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1UYq7ZlpuPFWfKgRhVlscqZTRODPH7iHddG6Vl79gQOjkgRo1Ot52UoL-xpKixDA710r77IgzI76vl7BgAEFjszMoJz7zycf1h0Eu0nBXbnpSs7m60YHFM3liThne8uhEBBvaN_5_ig2J9GtcCYzkRQZ0U3bjtILbh75U9fdG3WFLlivx8BxEr3ZkJhTjhMOngXWVka4ZSVn9v55o0IBt37NckuDCXXL-0fbBsOKPzUTJTe0epblGdCSw'

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-outline-variant/20">
          {/* Brand */}
          <div className="md:col-span-6 lg:col-span-6">
            <div className="flex items-center gap-2 mb-4">
              <img alt="OVERKAP Streetwear Logo" className="h-6 w-auto object-contain" src={LOGO_URL} />
              <span className="font-headline-sm text-headline-sm font-bold uppercase tracking-tight text-on-surface">
                OVERKAP
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
              Arquitectura urbana, gorras estructuradas y streetwear de alto gramaje para entornos hostiles.
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
              <li><Link to="/faq-contacto" className="hover:text-on-surface cursor-pointer">CONTACTO DIRECTO</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-label-mono text-[11px] text-outline">
          <div className="flex items-center gap-3">
            <span>© 2025 OVERKAP CLOTHING DIVISION. ALL RIGHTS RESERVED.</span>
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
