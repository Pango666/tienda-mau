import supabase from '../../../core/supabaseClient'
import type { ProductWithDetails, DeliveryPoint, Category } from '../../../types'

export async function fetchProducts(): Promise<ProductWithDetails[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*),
      product_images (*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data as ProductWithDetails[]) || []
}

export async function fetchProductById(id: string): Promise<ProductWithDetails | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*),
      product_images (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as ProductWithDetails
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return (data as Category[]) || []
}

export async function fetchDeliveryPoints(): Promise<DeliveryPoint[]> {
  const { data, error } = await supabase
    .from('delivery_points')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching delivery points:', error)
    return []
  }

  return (data as DeliveryPoint[]) || []
}
