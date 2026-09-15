import supabase from '../../../core/supabaseClient'
import type { CartItem } from '../../../types'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '59170000000'

export async function processCheckout(
  customerName: string,
  customerPhone: string,
  deliveryPointId: string,
  items: CartItem[],
  totalAmount: number
): Promise<string> {
  // 1. Validate
  if (!customerName.trim()) throw new Error('El nombre del cliente es obligatorio')
  if (!customerPhone.trim()) throw new Error('El teléfono es obligatorio')
  if (!deliveryPointId) throw new Error('Selecciona un punto de entrega')
  if (items.length === 0) throw new Error('El carrito está vacío')

  let orderId = crypto.randomUUID()
  try {
    // 2. INSERT order with predefined UUID (no select needed)
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_point_id: deliveryPointId,
        total_amount: totalAmount,
        status: 'pending',
      })

    if (!orderError) {
      // 3. INSERT order_items in bulk with unit_price
      const orderItems = items.map(item => ({
        order_id: orderId,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) {
        console.warn('Could not save order items to DB:', itemsError)
      }
    } else {
      console.warn('Could not save order to DB, proceeding to WhatsApp anyway:', orderError)
    }
  } catch (dbError) {
    console.warn('Database error during checkout, proceeding to WhatsApp anyway:', dbError)
  }

  // 4. Build WhatsApp message
  const detail = items
    .map(
      i =>
        `- ${i.quantity}x ${i.title} (Talla: ${i.size}, Color: ${i.color}) - Bs.${(i.quantity * i.price).toFixed(2)}`
    )
    .join('\n')

  const adminLink = `${window.location.origin}/admin/orders/${orderId}`
  const message = `Hola, quiero confirmar mi pedido #${orderId.slice(0, 8)}.\nCliente: ${customerName.trim()}\nTeléfono: ${customerPhone.trim()}\nDetalle:\n${detail}\nTotal: Bs.${totalAmount.toFixed(2)}\n\nVer orden en sistema: ${adminLink}`

  // 5. Open WhatsApp in new tab
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  window.open(waUrl, '_blank')

  return orderId
}
