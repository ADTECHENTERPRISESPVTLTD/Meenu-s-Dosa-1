import { menu, locations, categories, siteConfig, type MenuItem, type Category } from './data'
import { readDb, writeDb } from './db-file'
import { withCollection, isMongoAvailable, connectMongo } from './mongo'

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

export interface Store {
  menu: MenuItem[]
  orders: Order[]
  bookings: Booking[]
  locations: Location[]
  content: Content
}

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

// ── File store helpers (fallback) ──
export function getFileStore(): Store {
  return readDb(createSeed)
}

export function saveFileStore(store: Store): void {
  writeDb(store)
}

export function resetFileStore(): void {
  writeDb(createSeed())
}

// ── MongoDB helpers ──
export async function seedMongo(): Promise<void> {
  const col = await withCollection('menu', async (c) => {
    const count = await c.countDocuments()
    if (count === 0) {
      await c.insertMany(menu.map((m) => ({ ...m })))
    }
    return c
  })
  if (!col) return

  const collections = ['orders', 'bookings', 'locations', 'content']
  for (const name of collections) {
    const existing = await withCollection(name, async (c) => c.countDocuments())
    if (existing === 0) {
      const seed = createSeed()
      const key = name as keyof Store
      const data = seed[key]
      if (name === 'content') {
        await withCollection(name, async (c) => {
          await c.replaceOne({}, data, { upsert: true })
          return c
        })
      } else if (Array.isArray(data)) {
        await withCollection(name, async (c) => {
          if (data.length > 0) await c.insertMany(data)
          return c
        })
      }
    }
  }
}

export async function mongoGet<T>(collection: string, query: Record<string, unknown> = {}): Promise<T[]> {
  return withCollection(collection, async (c) => {
    const docs = await c.find(query).toArray()
    return docs as unknown as T[]
  }) || []
}

export async function mongoGetOne<T>(collection: string, query: Record<string, unknown>): Promise<T | null> {
  return withCollection(collection, async (c) => (await c.findOne(query)) as unknown as T | null)
}

export async function mongoInsertOne<T extends { id: string }>(collection: string, doc: T): Promise<T | null> {
  return withCollection(collection, async (c) => {
    await c.insertOne(doc)
    return doc
  })
}

export async function mongoUpdateOne(collection: string, id: string, updates: Record<string, unknown>): Promise<boolean> {
  return withCollection(collection, async (c) => {
    const result = await c.updateOne({ id }, { $set: updates })
    return result.modifiedCount > 0
  }) || false
}

export async function mongoDeleteOne(collection: string, id: string): Promise<boolean> {
  return withCollection(collection, async (c) => {
    const result = await c.deleteOne({ id })
    return result.deletedCount > 0
  }) || false
}

// ── Unified data access ──
export async function getStore(): Promise<Store> {
  if (isMongoAvailable()) {
    await connectMongo()
    const [menuDocs, orders, bookings, locations, content] = await Promise.all([
      mongoGet<MenuItem>('menu'),
      mongoGet<Order>('orders'),
      mongoGet<Booking>('bookings'),
      mongoGet<Location>('locations'),
      mongoGetOne<Content>('content', {}),
    ])
    if (menuDocs.length > 0 || orders.length > 0 || bookings.length > 0 || locations.length > 0 || content) {
      return {
        menu: menuDocs.length ? menuDocs : createSeed().menu,
        orders,
        bookings,
        locations,
        content: content || createSeed().content,
      }
    }
  }
  return getFileStore()
}

export async function saveStore(store: Store): Promise<void> {
  if (isMongoAvailable()) {
    await connectMongo()
    await Promise.all([
      withCollection('menu', async (c) => { await c.deleteMany({}); if (store.menu.length) await c.insertMany(store.menu) }),
      withCollection('orders', async (c) => { await c.deleteMany({}); if (store.orders.length) await c.insertMany(store.orders) }),
      withCollection('bookings', async (c) => { await c.deleteMany({}); if (store.bookings.length) await c.insertMany(store.bookings) }),
      withCollection('locations', async (c) => { await c.deleteMany({}); if (store.locations.length) await c.insertMany(store.locations) }),
      withCollection('content', async (c) => { await c.replaceOne({}, store.content, { upsert: true }) }),
    ])
    return
  }
  saveFileStore(store)
}

export function uuid() {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

export function categoriesList(): Category[] {
  return categories
}