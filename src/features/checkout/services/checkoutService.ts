import supabase from '../../../core/supabaseClient'
import type { CartItem } from '../../../types'

const WHATSAPP_NUMBER = '59170000000'

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

  // 2. INSERT order → get order_id
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      delivery_point_id: deliveryPointId,
      total_amount: totalAmount,
      status: 'pending',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    throw new Error('Error al registrar el pedido: ' + (orderError?.message || 'Unknown'))
  }

  // 3. INSERT order_items in bulk with unit_price
  const orderItems = items.map(item => ({
    order_id: order.id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    unit_price: item.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    throw new Error('Error al registrar los items: ' + itemsError.message)
  }

  // 4. Build WhatsApp message
  const detail = items
    .map(
      i =>
        `- ${i.quantity}x ${i.title} (Talla: ${i.size}, Color: ${i.color}) - Bs.${(i.quantity * i.price).toFixed(2)}`
    )
    .join('\n')

  const message = `Hola, quiero confirmar mi pedido #${order.id.slice(0, 8)}.\nCliente: ${customerName.trim()}\nTeléfono: ${customerPhone.trim()}\nDetalle:\n${detail}\nTotal: Bs.${totalAmount.toFixed(2)}`

  // 5. Open WhatsApp in new tab
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  window.open(waUrl, '_blank')

  return order.id
}
