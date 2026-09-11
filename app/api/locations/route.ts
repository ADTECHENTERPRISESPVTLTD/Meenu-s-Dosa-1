import { NextResponse } from 'next/server'
import { store, uuid } from '@/lib/store'

export function GET() {
  return NextResponse.json({ ok: true, locations: store.get().locations })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { name, address, phone, hours, mapsUrl, zomatoUrl, swiggyUrl } = body as Record<string, unknown>
  if (!name || !address) return NextResponse.json({ ok: false, error: 'name and address required' }, { status: 400 })
  const s = store.get()
  const loc = {
    id: uuid(),
    name: String(name),
    address: String(address),
    phone: String(phone || ''),
    hours: String(hours || ''),
    mapsUrl: String(mapsUrl || ''),
    zomatoUrl: String(zomatoUrl || ''),
    swiggyUrl: String(swiggyUrl || ''),
  }
  s.locations.push(loc)
  return NextResponse.json({ ok: true, location: loc })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
  const s = store.get()
  const before = s.locations.length
  s.locations = s.locations.filter((l) => l.id !== id)
  return NextResponse.json({ ok: true, deleted: before - s.locations.length })
}