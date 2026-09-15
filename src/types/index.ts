// ----- Categories -----

export interface Category {
  id: string
  parent_id: string | null
  name: string
  slug: string
  created_at: string
}

// ----- Products -----

export interface Product {
  id: string
  category_id: string | null
  title: string
  description: string | null
  material: string | null
  care_instructions: string | null
  base_price: number
  is_active: boolean
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string | null
  size: string
  color: string
  stock: number
  price_adjustment: number
  is_active: boolean
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  color_reference: string | null
  is_primary: boolean
}

export interface ProductWithDetails extends Product {
  product_variants: ProductVariant[]
  product_images: ProductImage[]
}

// ----- Delivery Points -----

export interface DeliveryPoint {
  id: string
  name: string
  address: string
  schedule: string | null
  maps_url: string | null
  is_active: boolean
}

// ----- Cart -----

export interface CartItem {
  variant_id: string
  title: string
  size: string
  color: string
  quantity: number
  price: number
  image: string
}

// ----- Orders -----

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  delivery_point_id: string | null
  total_amount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
}

export interface OrderWithDetails extends Order {
  order_items: OrderItemWithVariant[]
  delivery_point?: DeliveryPoint
}

export interface OrderItem {
  id: string
  order_id: string
  variant_id: string
  quantity: number
  unit_price: number
}

export interface OrderItemWithVariant extends OrderItem {
  product_variant?: ProductVariant & {
    product?: Product
  }
}
