import { NextResponse } from 'next/server'
import { store, uuid, type MenuItem } from '@/lib/store'

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const s = store.get()
  let items = s.menu
  if (category && category !== 'all') items = items.filter((m) => m.category === category)
  return NextResponse.json({ ok: true, items, count: items.length })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { name, category, price, available, vegetarian, image } = body as Partial<MenuItem>
  if (!name || !category) return NextResponse.json({ ok: false, error: 'name and category required' }, { status: 400 })
  const s = store.get()
  const item: MenuItem = {
    id: uuid(),
    name: String(name),
    category: String(category),
    price: Number(price) || undefined,
    available: available !== false,
    vegetarian: vegetarian !== false,
    image: String(image || ''),
  }
  s.menu.unshift(item)
  return NextResponse.json({ ok: true, item })
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { id, ...updates } = body as { id?: string } & Partial<MenuItem>
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
  const s = store.get()
  const item = s.menu.find((m) => m.id === id)
  if (!item) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
  Object.assign(item, updates)
  return NextResponse.json({ ok: true, item })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
  const s = store.get()
  const before = s.menu.length
  s.menu = s.menu.filter((m) => m.id !== id)
  return NextResponse.json({ ok: true, deleted: before - s.menu.length })
}