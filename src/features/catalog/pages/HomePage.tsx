import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/catalogService'
import type { ProductWithDetails } from '../../../types'
import ProductCard from '../components/ProductCard'
import Toast, { useToast } from '../../../shared/Toast'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDfDXOaAER6vXJVlJ4nHTGfTyy0E0K9d_WftF2rvLk5-ThJrAW6xTDXu44X2H-Kfv2GAG-EU3gmk_ISMoCjywGobCIcIYYUYULFvc9gIVooyoDDrQP3d9OPahGQs8m3o7QDNbNF__98s7IhHiMa2TwCFfMmVcaUGggTD0PGMilTzNXvqMFeNvBUHnAen8zgMqZ5z9Uu6tw13VmA7KqNabnxPKfmgmiPcTEgni5L3OvQih6gljpyeuTS'

const LOOKBOOK_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBzoYhzxUZ1G9aJ6WWBoXP4skVAFEFv0H9lDzW9n6_F0T9r7LvVLWn2kf8tP7GEb1DVGKHa7ALjwFRNgiLYyfIM5G4Ab6N7FIcupp52fZ-JJ0g5QcG_4VcttrcSDbn2sYgvJLjc_nndiaoA2D4_PEzgLviEXCkxBMl-l_r5HS_E-nb63azfVJB3av2s9qy72e3AGFqcGGYbX6GvClGjo_VAfo7pWN1vfQLBrHiT7iNx35DFjc8rWsyk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDf6d5HemDo9z0zEARajtXU7nqovC7zkY2WX7x3kL6XnJ43WUKz_7aiX1BKivEWuYiaNsTDb8h9iZL2HuAh6xiiVlJwz0ea1ZqU0DibbEe6mADb54QFU4GhPGcWkwetIz0S62alf0IjJkUJhFT7KpsLnWD12m3WE-n8Dn1gzhg8NHAc6PRpIO9YEqDUdSv7f_QZJ4JiCYysoocENiX0Noq4NyPscy0sNaRHgwYmG3pr34TorcForqIC',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDZFoweByYtqkGSA_JxSJoW0y_TtB8tSW7dc6JE1YLnvAlpxH6AoXUESpkSE68bo-IW25yyf8CFg3_n2byP-fJl2WlKLV0b6h5o3jrWnI-MfCiGVW9nQieNerKjPJH6NLwKtKLVVmc1565sYFyI-_h-F9yV1221R_9Cf1dKRrAnPvwFEPOudiC-VEIul7OTilztxA0-w7bY05auMQyGDllwTRqGfH360MK3NgM7FZkS8rGsCzsuCz9V',
]

const PROMO_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCezOM5jLD0hBkH7HBKA3FleuWqo94sVZorgCfPjOQ41ZcMsnOsp9JQ-5rYQ_Qkcy29DOsC0mdPk4OXcoYAhi-NehBvlwKQQ4Uufk-iGTmMybXe_JLHcaGQEjijf8QxL0xnHtBK5wCy5b65mKt_Gt0JJ-oCSHICAFp1qFMqMoz7C1dIcYZF-OzkLaffBumhNdcqZSguiDVwVoBaz1LQyZlUaS7zBd469ar2OSz71jeGaPUHFarv2nBq'

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const { toast, showToast, hideToast } = useToast()

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: '02', hours: '14', mins: '38', secs: '52'
  })

  useEffect(() => {
    fetchProducts().then(data => setProducts(data.slice(0, 4)))
  }, [])

  useEffect(() => {
    let totalSeconds = 2 * 86400 + 14 * 3600 + 38 * 60 + 52
    const interval = setInterval(() => {
      if (totalSeconds <= 0) return
      totalSeconds--
      const d = Math.floor(totalSeconds / 86400)
      const h = Math.floor((totalSeconds % 86400) / 3600)
      const m = Math.floor((totalSeconds % 3600) / 60)
      const s = totalSeconds % 60
      setCountdown({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0'),
      })
    }, 1000)
    return () => clearInterval(interval)
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
          <div className="lg:col-span-7 flex flex-col justify-between bg-surface-container-low p-6 md:p-10 lg:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute right-4 top-4 font-label-mono text-[90px] text-surface-container-highest/20 font-black leading-none select-none pointer-events-none -z-0">04</div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-surface-container-highest px-3 py-1 text-on-surface-variant font-label-mono text-label-mono mb-6">
                <span className="w-2 h-2 bg-primary-container"></span>
                <span>SPEC: COLECCIÓN FW25 // ARCHIVO VERIFICADO</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-extrabold text-on-surface tracking-tighter uppercase mb-4 leading-none">
                COLECCIÓN 04 // <br className="hidden sm:inline" />
                <span className="text-primary-container">ROPA</span> URBANA
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-xl mb-8">
                Streetwear apparel engineered for the concrete culture. Telas técnicas reforzadas, calce estructurado milimétrico e insignias reflectivas grado militar.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-10 max-w-lg">
                <div className="bg-surface-container p-3">
                  <span className="block font-label-mono text-label-mono text-outline uppercase">SERIE</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">300 PZ</span>
                </div>
                <div className="bg-surface-container p-3">
                  <span className="block font-label-mono text-label-mono text-outline uppercase">GRAMAJE</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">420 GSM</span>
                </div>
                <div className="bg-surface-container p-3">
                  <span className="block font-label-mono text-label-mono text-outline uppercase">STATUS</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-primary flex items-center gap-1">DISPONIBLE</span>
                </div>
              </div>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/catalogo"
                className="bg-primary-container hover:bg-on-surface hover:text-surface text-on-primary-container font-headline-sm text-headline-sm px-8 py-4 uppercase font-bold tracking-tight text-center transition-colors shadow-md flex items-center justify-center gap-3 group"
              >
                <span>VER COLECCIÓN</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
              <a className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-label-caps px-6 py-4 uppercase tracking-widest text-center transition-colors flex items-center justify-center gap-2" href="#lookbook-seccion">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>LOOKBOOK FW25</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative bg-surface-container-lowest min-h-[480px] lg:min-h-full overflow-hidden shadow-xl group">
            <img
              alt="Streetwear model wearing Nocturnal technical cap and tactical outerwear"
              className="w-full h-full object-cover object-center filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              src={HERO_IMAGE}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-90 lg:opacity-75"></div>
            <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm p-3 max-w-[200px]">
              <span className="font-label-mono text-[9px] text-primary block">// ARCHIVO CULTURA URBANA</span>
              <span className="font-headline-sm text-body-md font-bold text-on-surface uppercase tracking-tight">JADE ADESINA</span>
              <span className="font-label-mono text-[10px] text-secondary block mt-1">OCT/NOV 2025 ISS. 04</span>
            </div>
            <div className="absolute bottom-4 right-4 bg-primary-container text-on-primary-container px-3 py-1 font-label-mono text-label-mono uppercase font-bold tracking-widest shadow-md">
              COLECCIÓN AUTÉNTICA
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: 'bolt', tag: '// DESPACHO PRIORITARIO', title: 'ENVÍOS RÁPIDOS 24/48H', desc: 'Rastreo satelital instantáneo y empaque termotellado a prueba de agua.' },
            { icon: 'published_with_changes', tag: '// RETORNO SIN RIESGO', title: '30 DÍAS DEVOLUCIÓN', desc: 'Cambio directo por talle o reembolso inmediato si no resiste tu entorno.' },
            { icon: 'lock', tag: '// SEGURIDAD CRIPTOGRÁFICA', title: 'PAGO SEGURO CIFRADO', desc: 'Transacciones blindadas de 256-bit: Apple Pay, Tarjetas y Criptoactivos.' },
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

      {/* Promo Banner */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-8 mb-6" id="lookbook-seccion">
        <div className="relative bg-surface-container-lowest overflow-hidden shadow-2xl p-8 md:p-12 lg:p-16">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-10"></div>
          <div
            className="absolute inset-0 bg-cover bg-right filter grayscale brightness-50 opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: `url('${PROMO_BG}')` }}
          ></div>
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-3 py-1 font-label-mono text-label-mono font-bold uppercase tracking-wider mb-4">
                <span>COLECCIÓN PROTOCOLO 05</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-extrabold text-on-surface uppercase tracking-tight leading-none mb-4">
                EDICIÓN LIMITADA // <br />
                <span className="text-primary-container">CULTURA URBANA</span>
              </h2>
              <p className="font-body-lg text-body-lg text-secondary max-w-xl mb-6">
                Colección cápsula de 150 piezas numeradas con herrajes de titanio negro y bordado ultravioleta reactivo. Los registros cierran automáticamente al agotarse las reservas.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-primary-container hover:bg-on-surface hover:text-surface text-on-primary-container font-headline-sm text-headline-sm px-8 py-3.5 uppercase font-bold tracking-tight transition-colors shadow-lg" type="button">
                  PRE-ORDENAR AHORA
                </button>
                <span className="font-label-mono text-label-mono text-outline uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                  SOLO 47 PLAZAS RESTANTES
                </span>
              </div>
            </div>

            {/* Countdown */}
            <div className="lg:col-span-5 bg-surface-container-low/90 backdrop-blur-md p-6 lg:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-4">
                <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">// TIEMPO PARA ACTIVACIÓN</span>
                <span className="font-label-mono text-[10px] text-outline">ACTIVACIÓN AUTOMÁTICA</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { val: countdown.days, label: 'DÍAS' },
                  { val: countdown.hours, label: 'HORAS' },
                  { val: countdown.mins, label: 'MINS' },
                  { val: countdown.secs, label: 'SEGS', accent: true },
                ].map((t, i) => (
                  <div key={i} className="bg-surface-container p-3">
                    <span className={`font-headline-md text-headline-md font-extrabold block ${t.accent ? 'text-primary-container' : 'text-on-surface'}`}>
                      {t.val}
                    </span>
                    <span className="font-label-mono text-[10px] text-outline uppercase block mt-1">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 flex items-center justify-between font-label-mono text-[11px] text-secondary">
                <span>RELEASE: 28 OCTUBRE 2025</span>
                <span>20:00 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-primary-container inline-block"></span>
            <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">// RADAR CULTURA URBANA</span>
          </div>
          <a className="font-label-mono text-label-mono text-secondary hover:text-on-surface uppercase flex items-center gap-1 transition-colors" href="#">
            <span>VER GALERÍA COMPLETA</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { img: LOOKBOOK_IMAGES[0], tag: '// 01 • SUBTERRÁNEO', title: 'Estética Cruda de Trinchera' },
            { img: LOOKBOOK_IMAGES[1], tag: '// 02 • MACRO TEXTURA', title: 'Bordado Táctico 3D' },
            { img: LOOKBOOK_IMAGES[2], tag: '// 03 • ROOFTOP CULTURE', title: 'Comunidad OVERKAP Global' },
          ].map((item, idx) => (
            <div key={idx} className="relative h-80 bg-surface-container overflow-hidden group shadow-md">
              <img className="w-full h-full object-cover filter contrast-125 group-hover:scale-105 transition-transform duration-500" src={item.img} alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-label-mono text-[9px] text-primary block">{item.tag}</span>
                <h4 className="font-headline-sm text-body-lg font-bold text-on-surface uppercase">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Toast message={toast.message} isVisible={toast.isVisible} onHide={hideToast} />
    </>
  )
}
