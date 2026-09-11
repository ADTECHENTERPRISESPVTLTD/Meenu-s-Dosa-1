import { NextResponse } from 'next/server'
import { store, uuid, type Order, type OrderStatus, type PaymentMethod } from '@/lib/store'

export function GET() {
  const s = store.get()
  return NextResponse.json({ ok: true, orders: s.orders })
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { id, status, paid } = body as { id?: string; status?: OrderStatus; paid?: boolean }
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
  const s = store.get()
  const order = s.orders.find((o) => o.id === id)
  if (!order) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
  if (status !== undefined) order.status = status
  if (paid !== undefined) order.paid = paid
  return NextResponse.json({ ok: true, order })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
  const s = store.get()
  s.orders = s.orders.filter((o) => o.id !== id)
  return NextResponse.json({ ok: true })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { items, total, paymentMethod, source } = body as {
    items?: { id: string; name: string; price: number; quantity: number }[]
    total?: number
    paymentMethod?: PaymentMethod
    source?: 'direct' | 'zomato' | 'swiggy'
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ ok: false, error: 'items required' }, { status: 400 })
  }
  const s = store.get()
  const order: Order = {
    id: uuid(),
    date: Date.now(),
    items,
    total: total || 0,
    paymentMethod: paymentMethod || 'cash',
    source: source || 'direct',
    status: 'pending',
    paid: false,
  }
  s.orders.unshift(order)
  return NextResponse.json({ ok: true, order })
}