import { store, uuid, type Order, type OrderStatus, type PaymentMethod } from '../store'

export const orderController = {
  async list() {
    return { ok: true, orders: store.get().orders }
  },

  async create(payload: {
    items?: { id: string; name: string; price: number; quantity: number }[]
    total?: number
    paymentMethod?: PaymentMethod
    source?: 'direct' | 'zomato' | 'swiggy'
  }) {
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      return { ok: false, error: 'items required', status: 400 }
    }
    const order: Order = {
      id: uuid(),
      date: Date.now(),
      items: payload.items,
      total: payload.total || 0,
      paymentMethod: payload.paymentMethod || 'cash',
      source: payload.source || 'direct',
      status: 'pending',
      paid: false,
    }
    store.get().orders.unshift(order)
    return { ok: true, order, status: 201 }
  },

  async update(id: string, updates: { status?: OrderStatus; paid?: boolean }) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const order = store.get().orders.find((o) => o.id === id)
    if (!order) return { ok: false, error: 'not found', status: 404 }
    if (updates.status !== undefined) order.status = updates.status
    if (updates.paid !== undefined) order.paid = updates.paid
    return { ok: true, order }
  },

  async remove(id: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const s = store.get()
    const before = s.orders.length
    s.orders = s.orders.filter((o) => o.id !== id)
    return { ok: true, deleted: before - s.orders.length }
  },
}