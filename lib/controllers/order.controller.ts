import { getStore, saveStore, uuid, type Order } from '../store'

export const orderController = {
  async list() {
    return { ok: true, orders: (await getStore()).orders }
  },

  async create(payload: {
    items?: { id: string; name: string; price: number; quantity: number }[]
    total?: number
    paymentMethod?: string
    source?: string
  }) {
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      return { ok: false, error: 'items required', status: 400 }
    }
    const s = await getStore()
    const order: Order = {
      id: uuid(),
      date: Date.now(),
      items: payload.items,
      total: payload.total || 0,
      paymentMethod: (payload.paymentMethod as any) || 'cash',
      source: (payload.source as any) || 'direct',
      status: 'pending',
      paid: false,
    }
    s.orders.unshift(order)
    await saveStore(s)
    return { ok: true, order, status: 201 }
  },

  async update(id: string, updates: { status?: string; paid?: boolean }) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const s = await getStore()
    const order = s.orders.find((o) => o.id === id)
    if (!order) return { ok: false, error: 'not found', status: 404 }
    if (updates.status !== undefined) order.status = updates.status as any
    if (updates.paid !== undefined) order.paid = updates.paid
    await saveStore(s)
    return { ok: true, order }
  },

  async remove(id: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const s = await getStore()
    const before = s.orders.length
    s.orders = s.orders.filter((o) => o.id !== id)
    await saveStore(s)
    return { ok: true, deleted: before - s.orders.length }
  },
}