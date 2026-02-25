import api from '@/lib/axios'
import type {
  ApiResponse,
  Contact,
  DashboardStats,
  Order,
  Pack,
  PaginatedResponse,
  Service,
  User,
} from '@/types'

export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put<ApiResponse<User>>('/auth/profile', data),
}

export const servicesApi = {
  getAll: () => api.get<ApiResponse<Service[]>>('/services'),
  getFeatured: () => api.get<ApiResponse<Service[]>>('/services/featured'),
  getBySlug: (slug: string) => api.get<ApiResponse<Service>>(`/services/${slug}`),
}

export const packsApi = {
  getAll: () => api.get<ApiResponse<Pack[]>>('/packs'),
  getBySlug: (slug: string) => api.get<ApiResponse<Pack>>(`/packs/${slug}`),
}

export const contactApi = {
  send: (data: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    api.post<ApiResponse<Contact>>('/contact', data),
}

export const ordersApi = {
  getAll: (page = 1) => api.get<PaginatedResponse<Order>>(`/orders?page=${page}`),
  getById: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  create: (data: { items: { pack_id: number; quantity: number }[]; notes?: string }) =>
    api.post<ApiResponse<Order>>('/orders', data),
}

export const adminApi = {
  dashboard: () => api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),

  services: {
    getAll: () => api.get<ApiResponse<Service[]>>('/admin/services'),
    getById: (id: number) => api.get<ApiResponse<Service>>(`/admin/services/${id}`),
    create: (data: Partial<Service>) => api.post<ApiResponse<Service>>('/admin/services', data),
    update: (id: number, data: Partial<Service>) => api.put<ApiResponse<Service>>(`/admin/services/${id}`, data),
    delete: (id: number) => api.delete<ApiResponse<null>>(`/admin/services/${id}`),
  },

  packs: {
    getAll: () => api.get<ApiResponse<Pack[]>>('/admin/packs'),
    getById: (id: number) => api.get<ApiResponse<Pack>>(`/admin/packs/${id}`),
    create: (data: Partial<Pack>) => api.post<ApiResponse<Pack>>('/admin/packs', data),
    update: (id: number, data: Partial<Pack>) => api.put<ApiResponse<Pack>>(`/admin/packs/${id}`, data),
    delete: (id: number) => api.delete<ApiResponse<null>>(`/admin/packs/${id}`),
  },

  orders: {
    getAll: (page = 1, status?: string) =>
      api.get<PaginatedResponse<Order>>(`/admin/orders?page=${page}${status ? `&status=${status}` : ''}`),
    getById: (id: number) => api.get<ApiResponse<Order>>(`/admin/orders/${id}`),
    updateStatus: (id: number, status: string) =>
      api.patch<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status }),
  },

  contacts: {
    getAll: (page = 1, unreadOnly = false) =>
      api.get<PaginatedResponse<Contact>>(`/admin/contacts?page=${page}${unreadOnly ? '&unread_only=1' : ''}`),
    getById: (id: number) => api.get<ApiResponse<Contact>>(`/admin/contacts/${id}`),
    delete: (id: number) => api.delete<ApiResponse<null>>(`/admin/contacts/${id}`),
  },
}
