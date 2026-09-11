import { store, uuid, type MenuItem } from '../store'

export const menuController = {
  async list(category?: string | null) {
    const items = store.get().menu
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
    store.get().menu.unshift(item)
    return { ok: true, item, status: 201 }
  },

  async update(id: string, updates: Partial<MenuItem>) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const item = store.get().menu.find((m) => m.id === id)
    if (!item) return { ok: false, error: 'not found', status: 404 }
    Object.assign(item, updates)
    return { ok: true, item }
  },

  async remove(id: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const s = store.get()
    const before = s.menu.length
    s.menu = s.menu.filter((m) => m.id !== id)
    return { ok: true, deleted: before - s.menu.length }
  },
}