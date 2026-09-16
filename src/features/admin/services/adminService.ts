import supabase from '../../../core/supabaseClient'
import type { ProductWithDetails, OrderWithDetails, DeliveryPoint } from '../../../types'

// ─── Dashboard Stats ───

export interface DashboardStats {
  salesToday: number
  pendingOrders: number
  totalStock: number
  totalProducts: number
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  // Sales today
  const { data: ordersToday } = await supabase
    .from('orders')
    .select('total_amount')
    .gte('created_at', todayISO)
    .in('status', ['pending', 'confirmed', 'completed'])

  const salesToday = (ordersToday || []).reduce((sum, o) => sum + Number(o.total_amount), 0)

  // Pending orders
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Total stock
  const { data: variants } = await supabase
    .from('product_variants')
    .select('stock')

  const totalStock = (variants || []).reduce((sum, v) => sum + Number(v.stock), 0)

  // Total products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return {
    salesToday,
    pendingOrders: pendingOrders || 0,
    totalStock,
    totalProducts: totalProducts || 0,
  }
}

// ─── Products CRUD ───

export async function fetchAllProducts(): Promise<ProductWithDetails[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*),
      product_images (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all products:', error)
    return []
  }

  return (data as ProductWithDetails[]) || []
}

export async function createProduct(product: {
  title: string
  description?: string
  material?: string
  care_instructions?: string
  base_price: number
  category_id?: string
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      is_active: true,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return null
  }

  return data.id
}

export async function updateProduct(id: string, updates: Partial<{
  title: string
  description: string
  material: string
  care_instructions: string
  base_price: number
  category_id: string
  is_active: boolean
}>): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating product:', error)
    return false
  }
  return true
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    return false
  }
  return true
}

// ─── Categories ───

export async function createCategory(category: {
  name: string
  slug: string
  description?: string
}): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .insert(category)

  if (error) {
    console.error('Error creating category:', error)
    return false
  }
  return true
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    return false
  }
  return true
}

// ─── Product Images ───

export async function uploadProductImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading image:', uploadError)
    return null
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
  return data.publicUrl
}

export async function createProductImage(productId: string, imageUrl: string, isPrimary: boolean = true): Promise<boolean> {
  const { error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: imageUrl,
      is_primary: isPrimary
    })

  if (error) {
    console.error('Error saving image record:', error)
    return false
  }
  return true
}

export async function deleteProductImage(imageId: string, imageUrl?: string): Promise<boolean> {
  if (imageUrl) {
    const fileName = imageUrl.split('/').pop()
    if (fileName) {
      // Intentar borrar del bucket, no bloquea si falla
      await supabase.storage.from('product-images').remove([fileName])
    }
  }

  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)

  if (error) {
    console.error('Error deleting image record:', error)
    return false
  }
  return true
}

// ─── Variants ───

export async function createVariant(variant: {
  product_id: string
  sku?: string
  size: string
  color: string
  stock: number
  price_adjustment?: number
}): Promise<boolean> {
  const { error } = await supabase
    .from('product_variants')
    .insert({
      ...variant,
      is_active: true,
    })

  if (error) {
    console.error('Error creating variant:', error)
    return false
  }
  return true
}

export async function updateVariantStock(variantId: string, stock: number): Promise<boolean> {
  const { error } = await supabase
    .from('product_variants')
    .update({ stock })
    .eq('id', variantId)

  if (error) {
    console.error('Error updating stock:', error)
    return false
  }
  return true
}

export async function updateVariant(variantId: string, updates: Partial<{
  size: string
  color: string
  stock: number
  sku: string
}>): Promise<boolean> {
  const { error } = await supabase
    .from('product_variants')
    .update(updates)
    .eq('id', variantId)

  if (error) {
    console.error('Error updating variant:', error)
    return false
  }
  return true
}

export async function deleteVariant(variantId: string): Promise<boolean> {
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', variantId)

  if (error) {
    console.error('Error deleting variant:', error)
    return false
  }
  return true
}

// ─── Orders ───

export async function fetchOrders(): Promise<OrderWithDetails[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product_variant:product_variants (
          *,
          product:products (id, title, base_price)
        )
      ),
      delivery_point:delivery_points (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return (data as unknown as OrderWithDetails[]) || []
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    return false
  }
  return true
}

// ─── Delivery Points CRUD ───

export async function fetchAllDeliveryPoints(): Promise<DeliveryPoint[]> {
  const { data, error } = await supabase
    .from('delivery_points')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching delivery points:', error)
    return []
  }

  return (data as DeliveryPoint[]) || []
}

export async function createDeliveryPoint(point: {
  name: string
  address: string
  schedule?: string
  maps_url?: string
}): Promise<boolean> {
  const { error } = await supabase
    .from('delivery_points')
    .insert({ ...point, is_active: true })

  if (error) {
    console.error('Error creating delivery point:', error)
    return false
  }
  return true
}

export async function updateDeliveryPoint(id: string, updates: Partial<{
  name: string
  address: string
  schedule: string
  maps_url: string
  is_active: boolean
}>): Promise<boolean> {
  const { error } = await supabase
    .from('delivery_points')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating delivery point:', error)
    return false
  }
  return true
}

export async function deleteDeliveryPoint(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('delivery_points')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting delivery point:', error)
    return false
  }
  return true
}
