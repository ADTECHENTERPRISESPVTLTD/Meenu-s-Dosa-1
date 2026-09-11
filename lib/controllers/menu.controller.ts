import { getStore, saveStore, uuid, type MenuItem, mongoInsertOne, mongoUpdateOne, mongoDeleteOne, mongoGet } from '../store'
import { isMongoAvailable } from '../mongo'

export const menuController = {
  async list(category?: string | null) {
    const items = (await getStore()).menu
    if (category && category !== 'all') {
      return { ok: true, items: items.filter((m) => m.category === category), count: items.length }
    }
    return { ok: true, items, count: items.length }
  },

  async create(payload: Partial<MenuItem>) {
    if (!payload.name || !payload.category) {
      return { ok: false, error: 'name and category required', status: 400 }
    }
    const item: MenuItem = {
      id: uuid(),
      name: String(payload.name),
      category: String(payload.category),
      price: Number(payload.price) || undefined,
      available: payload.available !== false,
      vegetarian: payload.vegetarian !== false,
      image: String(payload.image || ''),
    }
    if (isMongoAvailable()) {
      const inserted = await mongoInsertOne('menu', item)
      if (inserted) return { ok: true, item, status: 201 }
    }
    const s = await getStore()
    s.menu.unshift(item)
    await saveStore(s)
    return { ok: true, item, status: 201 }
  },

  async update(id: string, updates: Partial<MenuItem>) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    if (isMongoAvailable()) {
      const updated = await mongoUpdateOne('menu', id, updates)
      if (updated) {
        const items = await mongoGet<MenuItem>('menu')
        const item = items.find((m) => m.id === id)
        return { ok: true, item }
      }
    }
    const s = await getStore()
    const item = s.menu.find((m) => m.id === id)
    if (!item) return { ok: false, error: 'not found', status: 404 }
    Object.assign(item, updates)
    await saveStore(s)
    return { ok: true, item }
  },

  async remove(id: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    if (isMongoAvailable()) {
      const deleted = await mongoDeleteOne('menu', id)
      if (deleted) return { ok: true, deleted: 1 }
    }
    const s = await getStore()
    const before = s.menu.length
    s.menu = s.menu.filter((m) => m.id !== id)
    await saveStore(s)
    return { ok: true, deleted: before - s.menu.length }
  },
}