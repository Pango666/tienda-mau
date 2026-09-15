import { useState } from 'react'

const FAQ_ITEMS = [
  {
    id: '01',
    question: '¿Cuánto tarda en llegar mi pedido?',
    answer: 'Los envíos nacionales estándar tienen un plazo de 2 a 4 días hábiles. El envío express (24-48h) está disponible para pedidos realizados antes de las 14:00h. El retiro en puntos pickup es inmediato tras la confirmación.',
  },
  {
    id: '02',
    question: '¿Puedo cambiar de talla si no me queda bien?',
    answer: 'Sí. Tienes 30 días desde la recepción para solicitar un cambio de talla sin costo adicional. La gorra debe estar en su estado original, sin uso visible ni alteraciones.',
  },
  {
    id: '03',
    question: '¿Cómo verifico la autenticidad de mi gorra OVERKAP?',
    answer: 'Cada gorra incluye un precinto holográfico de seguridad en la visera y una etiqueta serializada con código QR. Escanea el código para acceder al certificado de autenticidad digital.',
  },
  {
    id: '04',
    question: '¿Hacen envíos internacionales?',
    answer: 'Sí, realizamos envíos a más de 40 países mediante DHL Express. El plazo estimado es de 3 a 5 días hábiles con rastreo completo. El costo de envío internacional es de Bs. 95.00.',
  },
  {
    id: '05',
    question: '¿Cómo funciona el sistema de drops limitados?',
    answer: 'Los drops se anuncian con 48 horas de anticipación en nuestro canal de Telegram y newsletter. Las piezas son numeradas y una vez agotadas no se reproducen. El registro de pre-orden se cierra automáticamente al completar el lote.',
  },
]

export default function FaqContactPage() {
  const [openFaq, setOpenFaq] = useState<string | null>('01')

  return (
    <>
      {/* Header */}
      <div className="w-full bg-surface-container-lowest py-8 px-4 md:px-margin-tablet lg:px-margin-desktop shadow-xl">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 bg-primary-container animate-pulse"></span>
              <span className="font-label-mono text-label-mono uppercase tracking-widest text-primary">SYS_DISPATCH // TICKET & DISPUTES SYSTEM</span>
              <span className="bg-surface-container-high px-2 py-0.5 font-label-mono text-label-mono text-on-surface-variant">LEVEL 01 SUPPORT</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg font-bold uppercase tracking-tight text-on-surface">
              CENTRO DE AYUDA & CONTACTO // PROTOCOL
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Envíos, cambios, devoluciones y soporte directo del equipo OVERKAP. Resolvemos incidencias técnicas, logísticas y consultas sobre lanzamientos numerados.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-high px-5 py-3 shadow-md self-start md:self-auto">
            <div className="flex flex-col">
              <span className="font-label-mono text-[10px] text-tertiary uppercase">TIEMPO MEDIO RESPUESTA</span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">1.8 HORAS</span>
            </div>
            <div className="w-px h-8 bg-surface-container-highest"></div>
            <div className="flex flex-col">
              <span className="font-label-mono text-[10px] text-tertiary uppercase">DISPONIBILIDAD HUB</span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">99.4% ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="w-full bg-surface-container-low py-6 px-4 md:px-margin-tablet lg:px-margin-desktop">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden bg-surface-container h-36 flex items-center p-6 shadow-md group">
            <div className="relative z-10 space-y-1">
              <span className="font-label-mono text-label-mono text-primary">// POLÍTICA DE SELLOS</span>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface uppercase">GARANTÍA DE PRECINTO</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Los precintos holográficos de visor garantizan autenticidad en cada tirada.</p>
            </div>
          </div>
          <div className="relative overflow-hidden bg-surface-container h-36 flex items-center p-6 shadow-md group">
            <div className="relative z-10 space-y-1">
              <span className="font-label-mono text-label-mono text-primary">// DESPACHO EXPRÉS</span>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface uppercase">PICKUP & LOCKERS</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Retiro sin contacto en menos de 120 minutos en puntos habilitados.</p>
            </div>
          </div>
          <div className="bg-surface-container h-36 p-5 flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-label-mono text-label-mono text-tertiary">// PROTOCOLO ENLACE DIRECTO</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary-container text-on-primary-container font-label-mono text-[10px] font-bold">ACTIVO</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">headset_mic</span>
              <div>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface block">WHATSAPP / BOT</span>
                <span className="font-label-mono text-body-sm text-on-surface-variant">+54 9 11 8844-0920</span>
              </div>
            </div>
            <div className="font-label-mono text-[10px] text-tertiary flex justify-between">
              <span>LUNES A SÁBADOS</span>
              <span>10:00 — 20:00 UTC-3</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full py-12 px-4 md:px-margin-tablet lg:px-margin-desktop">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="flex items-center justify-between pb-2 bg-surface-container-low p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">live_help</span>
                <h2 className="font-headline-md text-headline-md font-bold uppercase tracking-tight text-on-surface">
                  PREGUNTAS FRECUENTES (FAQ)
                </h2>
              </div>
              <span className="font-label-mono text-label-mono text-outline bg-surface-container-high px-2 py-1">[ 05 CLAVES ]</span>
            </div>

            <div className="flex flex-col space-y-3">
              {FAQ_ITEMS.map(faq => (
                <div key={faq.id} className="bg-surface-container-low shadow-md overflow-hidden transition-all duration-200">
                  <button
                    className="w-full text-left p-5 flex items-center justify-between gap-4 bg-surface-container hover:bg-surface-bright text-on-surface transition-colors focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-label-mono text-label-mono text-primary font-bold">{faq.id} //</span>
                      <span className="font-headline-sm text-headline-sm font-bold tracking-tight uppercase">{faq.question}</span>
                    </div>
                    <span className={`material-symbols-outlined text-primary transition-transform duration-200 ${openFaq === faq.id ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {openFaq === faq.id && (
                    <div className="p-5 pt-0 bg-surface-container-low">
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-low p-6 md:p-8 shadow-xl flex flex-col gap-6">
              <div>
                <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">// ENVIAR TICKET</span>
                <h3 className="font-headline-md text-headline-md font-bold uppercase tracking-tight text-on-surface mt-1">FORMULARIO DE CONTACTO</h3>
              </div>
              <div className="flex flex-col gap-4">
                <input className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container uppercase placeholder:text-secondary-container" placeholder="NOMBRE COMPLETO" type="text" />
                <input className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container uppercase placeholder:text-secondary-container" placeholder="EMAIL DE CONTACTO" type="email" />
                <div className="relative">
                  <select className="w-full appearance-none bg-surface-container font-label-mono text-body-sm px-4 py-3 pr-10 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container uppercase cursor-pointer">
                    <option value="">TIPO DE CONSULTA</option>
                    <option>ENVÍOS Y LOGÍSTICA</option>
                    <option>CAMBIOS Y DEVOLUCIONES</option>
                    <option>AUTENTICIDAD</option>
                    <option>DROPS Y PRE-ORDENES</option>
                    <option>OTRO</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-on-surface-variant">expand_more</span>
                </div>
                <textarea className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container uppercase placeholder:text-secondary-container min-h-[120px] resize-none" placeholder="DESCRIBE TU CONSULTA EN DETALLE..."></textarea>
                <button className="w-full py-3.5 bg-primary-container hover:bg-on-surface text-on-primary-container hover:text-surface font-headline-sm text-headline-sm uppercase font-bold tracking-tight transition-all shadow-md flex items-center justify-center gap-3" type="button">
                  <span className="material-symbols-outlined">send</span>
                  <span>ENVIAR TICKET</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
