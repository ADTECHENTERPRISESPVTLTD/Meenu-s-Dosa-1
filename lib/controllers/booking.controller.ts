import { getStore, saveStore, uuid, type Booking, mongoInsertOne, mongoUpdateOne, mongoDeleteOne, mongoGet } from '../store'
import { isMongoAvailable } from '../mongo'

export const bookingController = {
  async list() {
    return { ok: true, bookings: (await getStore()).bookings }
  },

  async create(payload: {
    name?: string
    phone?: string
    email?: string
    outlet?: string
    date?: string
    time?: string
    guests?: number
    message?: string
  }) {
    if (!payload.name || !payload.phone || !payload.date || !payload.time) {
      return { ok: false, error: 'name, phone, date and time are required', status: 400 }
    }
    const booking: Booking = {
      id: uuid(),
      name: String(payload.name),
      phone: String(payload.phone),
      email: String(payload.email || ''),
      outlet: String(payload.outlet || ''),
      date: String(payload.date),
      time: String(payload.time),
      guests: Number(payload.guests) || 1,
      message: String(payload.message || ''),
      status: 'pending',
      createdAt: Date.now(),
    }
    if (isMongoAvailable()) {
      const inserted = await mongoInsertOne('bookings', booking)
      if (inserted) return { ok: true, booking, status: 201 }
    }
    const s = await getStore()
    s.bookings.unshift(booking)
    await saveStore(s)
    return { ok: true, booking, status: 201 }
  },

  async update(id: string, status: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    if (isMongoAvailable()) {
      const updated = await mongoUpdateOne('bookings', id, { status })
      if (updated) {
        const bookings = await mongoGet<Booking>('bookings')
        const booking = bookings.find((b) => b.id === id)
        return { ok: true, booking }
      }
    }
    const s = await getStore()
    const booking = s.bookings.find((b) => b.id === id)
    if (!booking) return { ok: false, error: 'not found', status: 404 }
    if (status) booking.status = status as any
    await saveStore(s)
    return { ok: true, booking }
  },

  async remove(id: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    if (isMongoAvailable()) {
      const deleted = await mongoDeleteOne('bookings', id)
      if (deleted) return { ok: true, deleted: 1 }
    }
    const s = await getStore()
    const before = s.bookings.length
    s.bookings = s.bookings.filter((b) => b.id !== id)
    await saveStore(s)
    return { ok: true, deleted: before - s.bookings.length }
  },
}