import { store, uuid, type Booking } from '../store'

export const bookingController = {
  async list() {
    return { ok: true, bookings: store.get().bookings }
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
    store.get().bookings.unshift(booking)
    return { ok: true, booking, status: 201 }
  },

  async update(id: string, status: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const booking = store.get().bookings.find((b) => b.id === id)
    if (!booking) return { ok: false, error: 'not found', status: 404 }
    if (status) booking.status = status as Booking['status']
    return { ok: true, booking }
  },

  async remove(id: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const s = store.get()
    const before = s.bookings.length
    s.bookings = s.bookings.filter((b) => b.id !== id)
    return { ok: true, deleted: before - s.bookings.length }
  },
}