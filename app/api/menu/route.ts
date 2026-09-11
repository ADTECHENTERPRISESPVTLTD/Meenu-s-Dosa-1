import { NextRequest, NextResponse } from 'next/server'
import { menuController } from '@/lib/controllers/menu.controller'

export function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category')
  return NextResponse.json(menuController.list(category))
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const result = await menuController.create(body)
  return NextResponse.json(result, { status: result.status || 200 })
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const result = await menuController.update(body.id, body)
  return NextResponse.json(result, { status: result.status || 200 })
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const result = await menuController.remove(id)
  return NextResponse.json(result, { status: result.status || 200 })
}