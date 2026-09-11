'use client'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const session = localStorage.getItem('meenu-dosa-admin-session')
    if (session) {
      const parsed = JSON.parse(session)
      return parsed.token || null
    }
  } catch {
    return null
  }
  return null
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const message = errorData.message || `HTTP error ${response.status}`
    throw new Error(message)
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data: unknown) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
}

export const menuApi = {
  list: (params?: { category?: string; available?: boolean; featured?: boolean; vegetarian?: boolean }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.available !== undefined) searchParams.set('available', String(params.available))
    if (params?.featured !== undefined) searchParams.set('featured', String(params.featured))
    if (params?.vegetarian !== undefined) searchParams.set('vegetarian', String(params.vegetarian))
    const query = searchParams.toString()
    return api.get<{ success: boolean; data: any[] }>(`/api/menu${query ? `?${query}` : ''}`)
  },
  get: (id: string) => api.get<{ success: boolean; data: any }>(`/api/menu/${id}`),
}

export const categoryApi = {
  list: (includeInactive = false) => api.get<{ success: boolean; data: any[] }>(`/api/categories${includeInactive ? '?includeInactive=true' : ''}`),
  get: (id: string) => api.get<{ success: boolean; data: any }>(`/api/categories/${id}`),
}

export const locationApi = {
  list: (includeInactive = false) => api.get<{ success: boolean; data: any[] }>(`/api/locations${includeInactive ? '?includeInactive=true' : ''}`),
  get: (id: string) => api.get<{ success: boolean; data: any }>(`/api/locations/${id}`),
}

export const bookingApi = {
  create: (data: {
    customerName: string
    phone: string
    date: string
    time: string
    guestCount: number
    message?: string
    location: string
  }) => api.post<{ success: boolean; data: any; message: string }>('/api/bookings', data),
}

export const orderApi = {
  create: (data: { items: { id: string; quantity: number }[]; paymentMethod: string; source: string }) => api.post<{ success: boolean; data: any; message: string }>('/api/orders', data),
}

export const settingsApi = {
  get: () => api.get<{ success: boolean; data: any }>('/api/settings'),
  getIntegrations: () => api.get<{ success: boolean; data: any }>('/api/settings/integrations'),
}

export const authApi = {
  login: (email: string, password: string) => api.post<{ success: boolean; data: { token: string; admin: any }; message: string }>('/api/admin/auth/login', { email, password }),
  me: () => api.get<{ success: boolean; data: any }>('/api/admin/auth/me'),
  logout: () => api.post<{ success: boolean; message: string }>('/api/admin/auth/logout', {}),
}

export const adminApi = {
  dashboard: () => api.get<{ success: boolean; data: any }>('/api/admin/dashboard'),
  menu: {
    list: () => api.get<{ success: boolean; data: any[] }>('/api/admin/menu'),
    create: (data: any) => api.post<{ success: boolean; data: any; message: string }>('/api/admin/menu', data),
    update: (id: string, data: any) => api.put<{ success: boolean; data: any; message: string }>(`/api/admin/menu/${id}`, data),
    delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/api/admin/menu/${id}`),
  },
  categories: {
    list: () => api.get<{ success: boolean; data: any[] }>('/api/admin/categories'),
    create: (data: any) => api.post<{ success: boolean; data: any; message: string }>('/api/admin/categories', data),
    update: (id: string, data: any) => api.put<{ success: boolean; data: any; message: string }>(`/api/admin/categories/${id}`, data),
    delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/api/admin/categories/${id}`),
  },
  bookings: {
    list: (params?: { status?: string; location?: string; from?: string; to?: string; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set('status', params.status)
      if (params?.location) searchParams.set('location', params.location)
      if (params?.from) searchParams.set('from', params.from)
      if (params?.to) searchParams.set('to', params.to)
      if (params?.page) searchParams.set('page', String(params.page))
      if (params?.limit) searchParams.set('limit', String(params.limit))
      const query = searchParams.toString()
      return api.get<{ success: boolean; data: { bookings: any[]; pagination: any } }>(`/api/admin/bookings${query ? `?${query}` : ''}`)
    },
    get: (id: string) => api.get<{ success: boolean; data: any }>(`/api/admin/bookings/${id}`),
    updateStatus: (id: string, status: string) => api.put<{ success: boolean; data: any; message: string }>(`/api/admin/bookings/${id}`, { status }),
    delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/api/admin/bookings/${id}`),
  },
  orders: {
    list: () => api.get<{ success: boolean; data: any[] }>('/api/admin/orders'),
    update: (id: string, data: { status?: string; paid?: boolean }) => api.put<{ success: boolean; data: any; message: string }>(`/api/admin/orders/${id}`, data),
    delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/api/admin/orders/${id}`),
  },
  locations: {
    list: () => api.get<{ success: boolean; data: any[] }>('/api/admin/locations'),
    create: (data: any) => api.post<{ success: boolean; data: any; message: string }>('/api/admin/locations', data),
    update: (id: string, data: any) => api.put<{ success: boolean; data: any; message: string }>(`/api/admin/locations/${id}`, data),
    delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/api/admin/locations/${id}`),
  },
  settings: {
    get: () => api.get<{ success: boolean; data: any }>('/api/admin/settings'),
    getIntegrations: () => api.get<{ success: boolean; data: any }>('/api/admin/settings/integrations'),
    update: (data: any) => api.put<{ success: boolean; data: any; message: string }>('/api/admin/settings', data),
    updateIntegrations: (data: any) => api.put<{ success: boolean; data: any; message: string }>('/api/admin/settings/integrations', data),
  },
}

export function setAuthToken(token: string, admin: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('meenu-dosa-admin-session', JSON.stringify({ token, admin, loggedInAt: Date.now() }))
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('meenu-dosa-admin-session')
  }
}

export function getStoredAdmin(): { token: string; admin: any } | null {
  if (typeof window === 'undefined') return null
  try {
    const session = localStorage.getItem('meenu-dosa-admin-session')
    if (session) {
      return JSON.parse(session)
    }
  } catch {
    return null
  }
  return null
}

export function isAdminAuthenticated(): boolean {
  return getStoredAdmin() !== null
}