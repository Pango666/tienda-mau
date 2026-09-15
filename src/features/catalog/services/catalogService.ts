import supabase from '../../../core/supabaseClient'
import type { ProductWithDetails } from '../../../types'

export async function fetchProducts(): Promise<ProductWithDetails[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*),
      product_images (*)
    `)

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
