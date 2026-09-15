const STORE_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTwlh_IQenJiJC8MRdjPOcqyC55oWv2aN2w2tlRdMNZhh4lPXXqZiXCHYdkQzOMKwO5ZzRP3NXavdcu03Uv1agiQ6hn7mHPgMpqGqdZOzi5vY4AVN3yTuHSdkbwEy--R2vj8v0HuZee-wpm8iS4fJMw3_JTxtZPpYNVNAwiRpWKkcX5sA7ZN4PqwPWOwDr_qEc2GTMp9PmFKDy-DkK_OdYs2VBxO-nuAYWrrKUJDFPXzXd1u3NTY5Z',
]

const LOCATIONS = [
  {
    hub: '01', type: 'FLAGSHIP',
    name: 'PUNTO ENTREGA CENTRO // FLAGSHIP OVERKAP',
    address: 'Calle Fuencarral 84, Distrito Centro (28004 Madrid)',
    hours: 'Lun a Sáb: 11:00h - 20:30h',
    phone: '+34 91 847 00 20',
    features: ['Cambio de talla en sitio', 'Empaque en caja rígida', 'Verificación holográfica'],
    status: 'Abierto hoy • Listo en 2 horas',
  },
  {
    hub: '02', type: 'HUB URBANO',
    name: 'HUB CHAMARTÍN // ESTACIÓN NORTE',
    address: 'Paseo de la Castellana 200, Locker Zone B2, Chamartín (28046 Madrid)',
    hours: 'Lun a Dom: 07:00h - 22:00h',
    phone: '+34 91 330 15 00',
    features: ['Locker automatizado 24h', 'Código QR de acceso', 'Sin contacto'],
    status: 'Abierto ahora • Retiro en 15 min',
  },
  {
    hub: '03', type: 'PARTNER STORE',
    name: 'PUNTO ASOCIADO LAVAPIÉS // COLLAB HUB',
    address: 'Calle Argumosa 11, Local 3, Lavapiés (28012 Madrid)',
    hours: 'Mar a Sáb: 12:00h - 21:00h',
    phone: '+34 91 468 88 10',
    features: ['Tienda independiente', 'Zona fitting room', 'Drops exclusivos collab'],
    status: 'Abierto mañana • Mar 12:00h',
  },
]

export default function DeliveryPointsPage() {
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
              Retira tus gorras y prendas urbanas sin costo de envío en nuestras tiendas y puntos autorizados. Cero esperas, empaque industrial y cambio de talla en sitio.
            </p>
          </div>
          <div className="bg-surface-container p-4 shadow-xl flex flex-col gap-2 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">NETWORK STATUS</span>
              <span className="font-label-mono text-label-mono text-primary font-bold">100% ONLINE</span>
            </div>
            <div className="text-2xl font-headline-sm font-bold text-on-surface tracking-tight flex items-baseline gap-2">
              <span>3 HUBS ACTIVOS</span>
              <span className="font-label-mono text-label-mono text-on-surface-variant font-normal">/ MADRID REGION</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 overflow-hidden">
              <div className="bg-primary-container h-full w-full animate-pulse"></div>
            </div>
            <span className="font-label-mono text-[10px] text-tertiary-container uppercase">TIEMPO PROMEDIO RETIRO: 12 MIN</span>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-[1440px] mx-auto mt-10">
          <div className="bg-surface-container-high p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-stretch justify-between">
            <div className="flex-1 relative flex items-center bg-surface-container-lowest px-4 py-3">
              <span className="material-symbols-outlined text-primary-container mr-3 text-2xl">pin_drop</span>
              <input className="w-full bg-transparent text-on-surface font-label-mono text-body-md placeholder:text-secondary-container focus:outline-none uppercase" placeholder="BUSCAR POR CÓDIGO POSTAL O BARRIO..." type="text" />
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
              <button className="flex-1 md:flex-initial px-6 py-3 bg-surface-container hover:bg-surface-bright text-on-surface font-label-caps text-label-caps uppercase flex items-center justify-center gap-2 transition-all shadow-sm" type="button">
                <span className="material-symbols-outlined text-lg text-primary">my_location</span>
                USAR MI UBICACIÓN
              </button>
              <button className="px-6 py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase hover:bg-white hover:text-on-primary-container transition-all shadow-md" type="button">
                LOCALIZAR HUB
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Location Cards */}
      <section className="w-full py-16 px-4 md:px-margin-tablet lg:px-margin-desktop bg-surface">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">// SELECCIÓN DE PUNTOS DISPONIBLES</span>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">ALMACENES & ESTACIONES AUTORIZADAS</h2>
            </div>
            <div className="font-label-mono text-body-sm text-outline flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary-container"></span>
              <span>SIN COSTE EXTRA EN CHECKOUT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {LOCATIONS.map(loc => (
              <article key={loc.hub} className="bg-surface-container flex flex-col justify-between shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative group">
                <div className="relative w-full h-56 overflow-hidden bg-surface-container-lowest">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" src={STORE_IMAGES[0]} alt={loc.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-primary-container text-on-primary-container px-3 py-1 font-label-mono text-label-mono tracking-widest font-bold">
                    [ HUB {loc.hub} // {loc.type} ]
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-surface-container-lowest/90 px-3 py-1 text-primary">
                    <span className="w-2 h-2 bg-primary-container animate-pulse"></span>
                    <span className="font-label-mono text-label-mono uppercase">{loc.status}</span>
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
                      <div className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-outline text-xl shrink-0 mt-0.5">schedule</span>
                        <p>{loc.hours}</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-outline text-xl shrink-0 mt-0.5">call</span>
                        <p>{loc.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {loc.features.map(feat => (
                      <span key={feat} className="bg-surface-container-high px-2 py-1 font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        {feat}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-surface-container-lowest hover:bg-primary-container text-on-surface hover:text-on-primary-container font-label-caps text-label-caps uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm" type="button">
                    <span className="material-symbols-outlined text-[18px]">directions</span>
                    CÓMO LLEGAR
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
