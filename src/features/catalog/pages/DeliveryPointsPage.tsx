import { useState, useEffect } from 'react'
import { fetchDeliveryPoints } from '../services/catalogService'
import type { DeliveryPoint } from '../../../types'

const STORE_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTwlh_IQenJiJC8MRdjPOcqyC55oWv2aN2w2tlRdMNZhh4lPXXqZiXCHYdkQzOMKwO5ZzRP3NXavdcu03Uv1agiQ6hn7mHPgMpqGqdZOzi5vY4AVN3yTuHSdkbwEy--R2vj8v0HuZee-wpm8iS4fJMw3_JTxtZPpYNVNAwiRpWKkcX5sA7ZN4PqwPWOwDr_qEc2GTMp9PmFKDy-DkK_OdYs2VBxO-nuAYWrrKUJDFPXzXd1u3NTY5Z',
]

export default function DeliveryPointsPage() {
  const [points, setPoints] = useState<DeliveryPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeliveryPoints().then(data => {
      setPoints(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="w-full bg-surface-container-lowest text-on-surface py-12 px-4 md:px-margin-tablet lg:px-margin-desktop relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-surface-container px-3 py-1 text-primary">
              <span className="w-2 h-2 bg-primary-container animate-ping"></span>
              <span className="font-label-mono text-label-mono tracking-widest uppercase">DISPATCH PROTOCOL // CLICK & COLLECT FREE</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg uppercase text-on-surface tracking-tighter leading-none">
              DÓNDE RECOGER <br /><span className="text-primary">TU PEDIDO</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl font-light">
              Retira tus prendas urbanas sin costo de envío en nuestras tiendas y puntos autorizados. Cero esperas, empaque industrial y cambio de talla en sitio.
            </p>
          </div>
          <div className="bg-surface-container p-4 shadow-xl flex flex-col gap-2 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">NETWORK STATUS</span>
              <span className="font-label-mono text-label-mono text-primary font-bold">
                {loading ? '...' : '100% ONLINE'}
              </span>
            </div>
            <div className="text-2xl font-headline-sm font-bold text-on-surface tracking-tight flex items-baseline gap-2">
              <span>{loading ? '...' : `${points.length} HUBS ACTIVOS`}</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 overflow-hidden">
              <div className="bg-primary-container h-full w-full animate-pulse"></div>
            </div>
            <span className="font-label-mono text-[10px] text-tertiary-container uppercase">RETIRO SIN COSTO ADICIONAL</span>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-[1440px] mx-auto mt-10">
          <div className="bg-surface-container-high p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-stretch justify-between">
            <div className="flex-1 relative flex items-center bg-surface-container-lowest px-4 py-3">
              <span className="material-symbols-outlined text-primary-container mr-3 text-2xl">pin_drop</span>
              <input className="w-full bg-transparent text-on-surface font-label-mono text-body-md placeholder:text-secondary-container focus:outline-none uppercase" placeholder="BUSCAR POR NOMBRE O DIRECCIÓN..." type="text" />
            </div>
          </div>
        </div>
      </section>

      {/* Location Cards */}
      <section className="w-full py-16 px-4 md:px-margin-tablet lg:px-margin-desktop bg-surface">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">// PUNTOS DISPONIBLES</span>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">ALMACENES & ESTACIONES AUTORIZADAS</h2>
            </div>
            <div className="font-label-mono text-body-sm text-outline flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary-container"></span>
              <span>SIN COSTE EXTRA EN CHECKOUT</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="material-symbols-outlined text-4xl animate-spin text-primary">autorenew</span>
            </div>
          ) : points.length === 0 ? (
            <div className="bg-surface-container-low p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-outline">location_off</span>
              <p className="font-label-mono text-body-md text-on-surface-variant mt-3">NO HAY PUNTOS DE ENTREGA DISPONIBLES EN ESTE MOMENTO</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {points.map((loc, idx) => (
                <article key={loc.id} className="bg-surface-container flex flex-col justify-between shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative group">
                  <div className="relative w-full h-56 overflow-hidden bg-surface-container-lowest">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" src={STORE_IMAGES[0]} alt={loc.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-primary-container text-on-primary-container px-3 py-1 font-label-mono text-label-mono tracking-widest font-bold">
                      [ HUB {String(idx + 1).padStart(2, '0')} ]
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-surface-container-lowest/90 px-3 py-1 text-primary">
                      <span className="w-2 h-2 bg-primary-container animate-pulse"></span>
                      <span className="font-label-mono text-label-mono uppercase">ACTIVO</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">
                        {loc.name}
                      </h3>
                      <div className="mt-4 space-y-2 text-on-surface-variant font-body-sm">
                        <div className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">storefront</span>
                          <p className="font-medium text-on-surface">{loc.address}</p>
                        </div>
                        {loc.schedule && (
                          <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-outline text-xl shrink-0 mt-0.5">schedule</span>
                            <p>{loc.schedule}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {loc.maps_url ? (
                      <a
                        href={loc.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-surface-container-lowest hover:bg-primary-container text-on-surface hover:text-on-primary-container font-label-caps text-label-caps uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[18px]">directions</span>
                        CÓMO LLEGAR
                      </a>
                    ) : (
                      <button className="w-full py-3 bg-surface-container-lowest text-on-surface-variant font-label-caps text-label-caps uppercase tracking-widest cursor-default flex items-center justify-center gap-2 shadow-sm" type="button" disabled>
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        DISPONIBLE
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
