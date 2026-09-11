import { menu, locations, categories, siteConfig, type MenuItem, type Category } from './data'

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
export type PaymentMethod = 'qr' | 'cash' | 'zomato' | 'swiggy'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  date: number
  items: OrderItem[]
  total: number
  paymentMethod: PaymentMethod
  source: 'direct' | 'zomato' | 'swiggy'
  status: OrderStatus
  paid: boolean
}

export interface Booking {
  id: string
  name: string
  phone: string
  email: string
  outlet: string
  date: string
  time: string
  guests: number
  message: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: number
}

export interface Location {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  mapsUrl: string
  zomatoUrl: string
  swiggyUrl: string
}

export interface Content {
  name: string
  tagline: string
  description: string
  phone: string
  whatsapp: string
  instagram: string
  zomato: string
  swiggy: string
}

interface Store {
  menu: MenuItem[]
  orders: Order[]
  bookings: Booking[]
  locations: Location[]
  content: Content
}

const globalKey = Symbol.for('meenu-dosa-store')

function createSeed(): Store {
  return {
    menu: menu.map((m) => ({ ...m })),
    orders: [],
    bookings: [],
    locations: locations.map((l) => ({ ...l })),
    content: {
      name: siteConfig.name,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      phone: '',
      whatsapp: siteConfig.integrations.whatsapp,
      instagram: siteConfig.integrations.instagram,
      zomato: siteConfig.integrations.zomato,
      swiggy: siteConfig.integrations.swiggy,
    },
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __MEENU_STORE__: Store | undefined
}

function getStore(): Store {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any
  if (!g[globalKey]) g[globalKey] = createSeed()
  return g[globalKey]
}

export const store = {
  get: (): Store => getStore(),
  reset: () => { (globalThis as Record<string, unknown>)[String(globalKey)] = createSeed() },
}

export function uuid() {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

export function categoriesList(): Category[] {
  return categories
}