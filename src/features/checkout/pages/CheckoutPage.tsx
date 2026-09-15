import { useState, useEffect } from 'react'
import { useCartContext } from '../../cart/context/CartContext'
import { processCheckout } from '../services/checkoutService'
import { fetchDeliveryPoints } from '../../catalog/services/catalogService'
import type { DeliveryPoint } from '../../../types'

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCartContext()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryPointId, setDeliveryPointId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([])

  const total = totalAmount()

  useEffect(() => {
    fetchDeliveryPoints().then(setDeliveryPoints)
  }, [])

  async function handleCheckout() {
    setError('')
    setIsProcessing(true)

    try {
      await processCheckout(customerName, customerPhone, deliveryPointId, items, total)
      clearCart()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-16">
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          <span className="material-symbols-outlined text-6xl text-outline">shopping_bag</span>
          <h1 className="font-headline-lg text-headline-md font-bold text-on-surface uppercase tracking-tight">
            CARRITO VACÍO
          </h1>
          <p className="font-body-lg text-body-lg text-secondary text-center max-w-md">
            Tu inventario personal está vacío. Explora el catálogo para añadir piezas técnicas a tu colección.
          </p>
          <a
            href="/catalogo"
            className="bg-primary-container hover:bg-on-surface hover:text-surface text-on-primary-container font-headline-sm text-headline-sm px-8 py-4 uppercase font-bold tracking-tight transition-colors shadow-md flex items-center gap-3"
          >
            <span>VER CATÁLOGO</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-margin-tablet lg:px-margin-desktop py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2 w-2 bg-primary-container inline-block"></span>
        <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">
          // CHECKOUT PROTOCOL
        </span>
      </div>
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-extrabold text-on-surface uppercase tracking-tight mb-8">
        CONFIRMAR PEDIDO
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-surface-container px-4 py-3 flex items-center justify-between">
            <span className="font-label-mono text-label-mono text-on-surface uppercase font-bold tracking-wider">
              // ITEMS EN CARRITO ({items.length})
            </span>
          </div>

          {items.map(item => (
            <div
              key={item.variant_id}
              className="bg-surface-container-low p-4 flex gap-4 items-start"
            >
              <div className="w-20 h-20 bg-surface-container-lowest overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-headline-sm text-body-md font-bold text-on-surface uppercase">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                        TALLA: {item.size}
                      </span>
                      <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                        COLOR: {item.color}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.variant_id)}
                    className="p-1 text-outline hover:text-primary transition-colors"
                    aria-label="Eliminar item"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center bg-surface-container">
                    <button
                      className="w-8 h-8 flex items-center justify-center font-label-mono text-on-surface hover:bg-surface-container-highest transition-colors"
                      onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center font-label-mono text-body-sm font-bold text-on-surface">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center font-label-mono text-on-surface hover:bg-surface-container-highest transition-colors"
                      onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-headline-sm text-body-md font-bold text-primary-container">
                    Bs.{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout form */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-low p-6 md:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">
                // DATOS DE ENTREGA
              </span>
            </div>

            {/* Name input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">
                01 // NOMBRE COMPLETO:
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="TU NOMBRE COMPLETO"
                className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-secondary-container"
              />
            </div>

            {/* Phone input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">
                02 // TELÉFONO / WHATSAPP:
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+591 7XXXXXXX"
                className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-secondary-container"
              />
            </div>

            {/* Delivery point select */}
            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">
                03 // PUNTO DE ENTREGA:
              </label>
              <div className="relative">
                <select
                  value={deliveryPointId}
                  onChange={e => setDeliveryPointId(e.target.value)}
                  className="w-full appearance-none bg-surface-container font-label-mono text-body-sm px-4 py-3 pr-10 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase cursor-pointer"
                >
                  <option value="">SELECCIONAR PUNTO...</option>
                  {deliveryPoints.map(point => (
                    <option key={point.id} value={point.id}>
                      {point.name.toUpperCase()} — {point.address}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-surface-container p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-mono text-label-mono text-outline uppercase">SUBTOTAL</span>
                <span className="font-label-mono text-body-sm text-on-surface font-bold">
                  Bs.{total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-label-mono text-label-mono text-outline uppercase">ENVÍO</span>
                <span className="font-label-mono text-body-sm text-primary font-bold uppercase">
                  GRATIS // PICKUP
                </span>
              </div>
              <div className="h-px bg-outline-variant/30"></div>
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface uppercase">TOTAL</span>
                <span className="font-headline-sm text-headline-sm font-bold text-primary-container">
                  Bs.{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-error-container p-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-on-error-container text-[18px]">error</span>
                <span className="font-label-mono text-body-sm text-on-error-container">{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing || !customerName.trim() || !customerPhone.trim() || !deliveryPointId}
              className="w-full py-4 px-6 bg-primary-container hover:bg-surface-bright text-on-primary-container hover:text-on-surface font-headline-sm text-headline-sm font-extrabold uppercase tracking-tight transition-all duration-200 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-2xl animate-spin">autorenew</span>
                  <span>PROCESANDO EN SISTEMA...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-2xl">send</span>
                  <span>CONFIRMAR PEDIDO VÍA WHATSAPP</span>
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 text-center font-label-mono text-[10px] text-tertiary-fixed-dim">
              <div className="bg-surface-container p-2 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-sm mb-0.5 text-outline">local_shipping</span>
                <span>RETIRO GRATIS</span>
              </div>
              <div className="bg-surface-container p-2 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-sm mb-0.5 text-outline">verified</span>
                <span>AUTÉNTICO 100%</span>
              </div>
              <div className="bg-surface-container p-2 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-sm mb-0.5 text-outline">sync</span>
                <span>RETORNO 14 DÍAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
