import { NextRequest, NextResponse } from 'next/server'
import { orderController } from '@/lib/controllers/order.controller'

export function GET() {
  return NextResponse.json(orderController.list())
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const result = await orderController.create(body)
  return NextResponse.json(result, { status: result.status || 200 })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const result = await orderController.update(body.id, body)
  return NextResponse.json(result, { status: result.status || 200 })
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const result = await orderController.remove(id)
  return NextResponse.json(result, { status: result.status || 200 })
}