import { NextResponse } from 'next/server'
import { store, uuid, type Booking } from '@/lib/store'

export function GET() {
  return NextResponse.json({ ok: true, bookings: store.get().bookings })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { name, phone, email, outlet, date, time, guests, message } = body as Record<string, unknown>
  if (!name || !phone || !date || !time) {
    return NextResponse.json({ ok: false, error: 'name, phone, date and time are required' }, { status: 400 })
  }
  const s = store.get()
  const booking: Booking = {
    id: uuid(),
    name: String(name),
    phone: String(phone),
    email: String(email || ''),
    outlet: String(outlet || ''),
    date: String(date),
    time: String(time),
    guests: Number(guests) || 1,
    message: String(message || ''),
    status: 'pending',
    createdAt: Date.now(),
  }
  s.bookings.unshift(booking)
  return NextResponse.json({ ok: true, booking })
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { id, status } = body as { id?: string; status?: string }
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
  const s = store.get()
  const booking = s.bookings.find((b) => b.id === id)
  if (!booking) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
  if (status) booking.status = status as Booking['status']
  return NextResponse.json({ ok: true, booking })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
  const s = store.get()
  s.bookings = s.bookings.filter((b) => b.id !== id)
  return NextResponse.json({ ok: true })
}