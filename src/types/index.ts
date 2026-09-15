// ----- Products -----

export interface Product {
  id: string
  title: string
  base_price: number
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string
  color: string
  stock: number
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
}

export interface ProductWithDetails extends Product {
  product_variants: ProductVariant[]
  product_images: ProductImage[]
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
  total_amount: number
  status: string
}

export interface OrderItem {
  id: string
  order_id: string
  variant_id: string
  quantity: number
}
