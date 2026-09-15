export default function AdminDashboardPage() {
  return (
    <>
      {/* Sub-Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-low p-6 rounded-none shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-primary-container"></span>
            <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">[ SYSTEM STATUS // OPTIMAL ]</span>
            <span className="text-outline-variant font-label-mono text-label-mono">/</span>
            <span className="font-label-mono text-label-mono text-secondary uppercase">LATENCY 14MS</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">PANEL DE CONTROL // STOCK LIVE</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative bg-surface-container flex items-center px-4 py-2.5">
            <span className="material-symbols-outlined text-outline text-[18px] mr-2">calendar_today</span>
            <select className="bg-transparent text-on-surface font-label-mono text-label-mono uppercase tracking-wider outline-none cursor-pointer pr-4 appearance-none">
              <option value="7d">Últimos 7 días</option>
              <option value="24h">Últimas 24 Horas</option>
              <option value="30d">Mes Actual (30D)</option>
            </select>
            <span className="material-symbols-outlined text-outline text-[16px] pointer-events-none absolute right-2">expand_more</span>
          </div>
          <button className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2.5 font-label-caps text-label-caps text-on-surface uppercase tracking-wider transition-colors shadow-sm" type="button">
            <span className="material-symbols-outlined text-[18px] text-tertiary">file_download</span>
            EXPORTAR CSV
          </button>
          <button className="flex items-center gap-2 bg-primary-container hover:bg-white text-on-primary-container hover:text-surface px-5 py-2.5 font-label-caps text-label-caps uppercase tracking-wider font-bold transition-all shadow-md" type="button">
            <span className="material-symbols-outlined text-[20px]">add_box</span>
            AÑADIR NUEVO PRODUCTO (+)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          {
            label: 'KPI // 001 - VENTAS DEL DÍA', icon: 'payments',
            value: '$3,480', unit: 'USD',
            trend: '+18.4%', trendLabel: 'vs ayer', trendUp: true,
          },
          {
            label: 'KPI // 002 - PEDIDOS PENDIENTES', icon: 'shopping_cart_checkout',
            value: '24', unit: 'ÓRDENES ACTIVAS',
            badges: ['16 COURIER', '8 PICKUP'],
          },
          {
            label: 'KPI // 003 - INVENTARIO EN BODEGA', icon: 'warehouse',
            value: '347', unit: 'UNIDADES TOTALES',
            trend: '-12 PCS', trendLabel: 'esta semana', trendUp: false,
          },
          {
            label: 'KPI // 004 - TASA DE CONVERSIÓN', icon: 'conversion_path',
            value: '4.2%', unit: 'CHECKOUT RATE',
            trend: '+0.8%', trendLabel: 'vs promedio', trendUp: true,
          },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-surface-container-low p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-colors">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 via-transparent to-transparent pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">{kpi.label}</span>
                <span className={`material-symbols-outlined text-[20px] ${idx === 0 ? 'text-primary' : 'text-outline'}`}>{kpi.icon}</span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">{kpi.value}</span>
                <span className="font-label-mono text-label-mono text-outline uppercase">{kpi.unit}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between">
              {kpi.trend && (
                <div className={`flex items-center gap-1.5 ${kpi.trendUp ? 'text-primary' : 'text-error'}`}>
                  <span className="material-symbols-outlined text-[16px]">{kpi.trendUp ? 'trending_up' : 'trending_down'}</span>
                  <span className="font-label-mono text-label-mono font-bold">{kpi.trend}</span>
                  <span className="font-label-mono text-label-mono text-outline">{kpi.trendLabel}</span>
                </div>
              )}
              {kpi.badges && (
                <div className="flex items-center gap-2">
                  {kpi.badges.map(b => (
                    <span key={b} className="px-2 py-0.5 bg-surface-container-high font-label-mono text-[10px] text-on-surface uppercase">{b}</span>
                  ))}
                </div>
              )}
              <div className="w-20 h-6">
                <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 80 24">
                  <path className="text-primary-container" d="M0 20 L15 14 L30 17 L45 8 L60 12 L75 3 L80 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <circle className="fill-primary" cx="80" cy="5" r="2.5" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-surface-container-low shadow-md">
        <div className="p-5 flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface uppercase">INVENTARIO ACTIVO</h2>
          </div>
          <span className="font-label-mono text-label-mono text-outline">ÚLTIMA SYNC: HACE 2 MIN</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container">
                <th className="p-3 text-left font-label-mono text-label-mono text-outline uppercase tracking-wider">SKU</th>
                <th className="p-3 text-left font-label-mono text-label-mono text-outline uppercase tracking-wider">PRODUCTO</th>
                <th className="p-3 text-left font-label-mono text-label-mono text-outline uppercase tracking-wider">TIPO</th>
                <th className="p-3 text-right font-label-mono text-label-mono text-outline uppercase tracking-wider">PRECIO</th>
                <th className="p-3 text-right font-label-mono text-label-mono text-outline uppercase tracking-wider">STOCK</th>
                <th className="p-3 text-center font-label-mono text-label-mono text-outline uppercase tracking-wider">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sku: 'OKP-091', name: 'OVERKAP Void Core 59', type: 'Snapback', price: '$55.00', stock: 3, status: 'LIMITED' },
                { sku: 'OKP-044', name: 'Grid Mesh Ballistic', type: 'Trucker', price: '$48.00', stock: 12, status: 'EN STOCK' },
                { sku: 'OKP-108', name: 'Distressed Acid Dad Cap', type: 'Dad Hat', price: '$42.00', stock: 8, status: 'EN STOCK' },
                { sku: 'OKP-220', name: 'Hazard Sector Flat Brim', type: 'Visera Plana', price: '$65.00', stock: 1, status: 'CRITICAL' },
                { sku: 'OKP-319', name: 'Tactical Ripstop 5-Panel', type: 'Camp Cap', price: '$50.00', stock: 15, status: 'EN STOCK' },
                { sku: 'OKP-412', name: 'Pure Monolith Snapback', type: 'Snapback', price: '$52.00', stock: 6, status: 'EN STOCK' },
              ].map(item => (
                <tr key={item.sku} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
                  <td className="p-3 font-label-mono text-label-mono text-on-surface-variant">{item.sku}</td>
                  <td className="p-3 font-headline-sm text-body-sm font-bold text-on-surface uppercase">{item.name}</td>
                  <td className="p-3 font-label-mono text-body-sm text-tertiary uppercase">{item.type}</td>
                  <td className="p-3 text-right font-label-mono text-body-sm font-bold text-on-surface">{item.price}</td>
                  <td className="p-3 text-right font-label-mono text-body-sm text-on-surface">{item.stock}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 font-label-mono text-[10px] font-bold uppercase ${
                      item.status === 'CRITICAL' ? 'bg-error-container text-on-error-container' :
                      item.status === 'LIMITED' ? 'bg-primary-container text-on-primary-container' :
                      'bg-surface-container-high text-on-surface'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
