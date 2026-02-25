export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  role: 'client' | 'admin'
  email_verified_at: string | null
  created_at: string
}

export interface Service {
  id: number
  title: string
  slug: string
  excerpt: string | null
  description: string
  icon: string | null
  image: string | null
  is_featured: boolean
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Pack {
  id: number
  name: string
  slug: string
  description: string
  features: string[]
  price: number
  original_price: number | null
  is_popular: boolean
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Contact {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface OrderItem {
  id: number
  pack_id: number | null
  pack_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: number
  reference: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes: string | null
  total: number
  items: OrderItem[]
  user?: User
  created_at: string
  updated_at: string
}

export interface CartItem {
  pack: Pack
  quantity: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface DashboardStats {
  users_count: number
  orders_count: number
  pending_orders: number
  revenue: number
  packs_count: number
  unread_contacts: number
  recent_orders: {
    id: number
    reference: string
    status: string
    total: number
    user_name: string
    created_at: string
  }[]
}
