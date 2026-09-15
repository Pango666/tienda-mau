export default function TopBanner() {
  return (
    <div className="w-full bg-primary-container text-on-primary-container px-4 py-1.5 flex items-center justify-between border-b border-outline-variant/30">
      <div className="hidden md:flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-on-primary-container animate-pulse"></span>
        <span className="font-label-mono text-label-mono uppercase tracking-widest">
          SYSTEM PROTOCOL // ONLINE
        </span>
      </div>
      <p className="w-full md:w-auto text-center font-label-mono text-label-mono uppercase tracking-widest">
        ENVÍO GRATIS EN PEDIDOS SUPERIORES A Bs. 450 | COLECCIÓN EXCLUSIVA FW25
      </p>
      <div className="hidden md:flex items-center gap-4">
        <span className="font-label-mono text-label-mono uppercase">[ REG: GLOBAL ]</span>
      </div>
    </div>
  )
}
