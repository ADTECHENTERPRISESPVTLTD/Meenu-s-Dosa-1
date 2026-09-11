import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

export function GET() {
  return NextResponse.json({ ok: true, content: store.get().content })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const s = store.get()
  s.content = { ...s.content, ...body }
  return NextResponse.json({ ok: true, content: s.content })
}