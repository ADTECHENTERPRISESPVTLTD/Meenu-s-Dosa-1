import { getStore, saveStore, uuid, type Booking } from '../store'

export const bookingController = {
  async list() {
    return { ok: true, bookings: (await getStore()).bookings }
  },

  async create(payload: {
    customerName?: string
    name?: string
    phone?: string
    email?: string
    location?: string
    outlet?: string
    date?: string
    time?: string
    guestCount?: number
    guests?: number
    message?: string
  }) {
    const name = payload.name || payload.customerName
    const outlet = payload.outlet || payload.location
    const guests = payload.guests ?? payload.guestCount
    if (!name || !payload.phone || !payload.date || !payload.time) {
      return { ok: false, error: 'name, phone, date and time are required', status: 400 }
    }
    const s = await getStore()
    const booking: Booking = {
      id: uuid(),
      name: String(name),
      phone: String(payload.phone),
      email: String(payload.email || ''),
      outlet: String(outlet || ''),
      date: String(payload.date),
      time: String(payload.time),
      guests: Number(guests) || 1,
      message: String(payload.message || ''),
      status: 'pending',
      createdAt: Date.now(),
    }
    s.bookings.unshift(booking)
    await saveStore(s)
    return { ok: true, booking, status: 201 }
  },

  async update(id: string, status: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const s = await getStore()
    const booking = s.bookings.find((b) => b.id === id)
    if (!booking) return { ok: false, error: 'not found', status: 404 }
    if (status) booking.status = status as any
    await saveStore(s)
    return { ok: true, booking }
  },

  async remove(id: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    const s = await getStore()
    const before = s.bookings.length
    s.bookings = s.bookings.filter((b) => b.id !== id)
    await saveStore(s)
    return { ok: true, deleted: before - s.bookings.length }
  },
}