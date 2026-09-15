import { useState, useEffect, useCallback } from 'react'
import { fetchOrders, updateOrderStatus } from '../services/adminService'
import type { OrderWithDetails } from '../../../types'

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'] as const

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending: { label: 'PENDIENTE', class: 'bg-primary-container text-on-primary-container' },
  confirmed: { label: 'CONFIRMADO', class: 'bg-surface-container-high text-primary' },
  completed: { label: 'COMPLETADO', class: 'bg-surface-container-high text-on-surface' },
  cancelled: { label: 'CANCELADO', class: 'bg-error-container text-on-error-container' },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    const data = await fetchOrders()
    setOrders(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  async function handleStatusChange(orderId: string, newStatus: string) {
    const ok = await updateOrderStatus(orderId, newStatus)
    if (ok) await loadOrders()
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">autorenew</span>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-low p-6 shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-primary-container"></span>
            <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">// ORDER MANAGEMENT SYSTEM</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">GESTIÓN DE PEDIDOS</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2.5 font-label-caps text-label-caps text-on-surface uppercase tracking-wider transition-colors shadow-sm"
            type="button"
            onClick={loadOrders}
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">refresh</span>
            ACTUALIZAR
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {['all', ...STATUS_OPTIONS].map(status => {
          const count = status === 'all' ? orders.length : orders.filter(o => o.status === status).length
          const label = status === 'all' ? 'TODOS' : STATUS_LABELS[status]?.label || status
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-label-mono text-label-mono uppercase tracking-wider transition-all ${
                filter === status
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-md'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {label} [{count}]
            </button>
          )
        })}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-surface-container-low p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-outline">receipt_long</span>
            <p className="font-label-mono text-body-md text-on-surface-variant mt-3">NO HAY PEDIDOS {filter !== 'all' ? `CON STATUS "${STATUS_LABELS[filter]?.label}"` : ''}</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const statusInfo = STATUS_LABELS[order.status] || { label: order.status, class: 'bg-surface-container text-on-surface' }
            const isExpanded = expandedOrder === order.id

            return (
              <div key={order.id} className="bg-surface-container-low shadow-md overflow-hidden">
                {/* Order header row */}
                <div
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-surface-container/50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-xl">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-body-md font-bold text-on-surface uppercase">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className={`px-2 py-0.5 font-label-mono text-[10px] font-bold uppercase ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-label-mono text-[11px] text-on-surface-variant">
                          <span className="material-symbols-outlined text-[14px] align-middle mr-1">person</span>
                          {order.customer_name}
                        </span>
                        <span className="font-label-mono text-[11px] text-on-surface-variant">
                          <span className="material-symbols-outlined text-[14px] align-middle mr-1">call</span>
                          {order.customer_phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="font-headline-sm text-headline-sm font-bold text-primary-container block">
                        Bs.{Number(order.total_amount).toFixed(2)}
                      </span>
                      <span className="font-label-mono text-[10px] text-outline">
                        {new Date(order.created_at).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-outline-variant/20 p-5 bg-surface-container/30">
                    {/* Delivery point */}
                    {order.delivery_point && (
                      <div className="flex items-center gap-2 mb-4 bg-surface-container px-3 py-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                        <span className="font-label-mono text-label-mono text-on-surface uppercase">
                          {order.delivery_point.name} — {order.delivery_point.address}
                        </span>
                      </div>
                    )}

                    {/* Items table */}
                    <div className="overflow-x-auto">
                      <table className="w-full mb-4">
                        <thead>
                          <tr className="bg-surface-container">
                            <th className="p-2 text-left font-label-mono text-[10px] text-outline uppercase">PRODUCTO</th>
                            <th className="p-2 text-left font-label-mono text-[10px] text-outline uppercase">VARIANTE</th>
                            <th className="p-2 text-right font-label-mono text-[10px] text-outline uppercase">CANT.</th>
                            <th className="p-2 text-right font-label-mono text-[10px] text-outline uppercase">PRECIO U.</th>
                            <th className="p-2 text-right font-label-mono text-[10px] text-outline uppercase">SUBTOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(order.order_items || []).map(item => (
                            <tr key={item.id} className="border-b border-outline-variant/10">
                              <td className="p-2 font-label-mono text-body-sm text-on-surface">
                                {item.product_variant?.product?.title || 'Producto desconocido'}
                              </td>
                              <td className="p-2 font-label-mono text-body-sm text-on-surface-variant">
                                {item.product_variant ? `${item.product_variant.size} / ${item.product_variant.color}` : '-'}
                              </td>
                              <td className="p-2 text-right font-label-mono text-body-sm text-on-surface">{item.quantity}</td>
                              <td className="p-2 text-right font-label-mono text-body-sm text-on-surface">
                                Bs.{Number(item.unit_price).toFixed(2)}
                              </td>
                              <td className="p-2 text-right font-label-mono text-body-sm font-bold text-on-surface">
                                Bs.{(item.quantity * Number(item.unit_price)).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Status actions */}
                    <div className="flex items-center gap-3 flex-wrap pt-2">
                      <span className="font-label-mono text-label-mono text-on-surface uppercase font-bold tracking-wider">
                        CAMBIAR STATUS:
                      </span>
                      {STATUS_OPTIONS.filter(s => s !== order.status).map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                          className={`px-3 py-1.5 font-label-mono text-[11px] uppercase tracking-wider transition-all hover:shadow-md ${
                            status === 'cancelled'
                              ? 'bg-error-container text-on-error-container hover:opacity-80'
                              : 'bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary-container'
                          }`}
                        >
                          → {STATUS_LABELS[status]?.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
