import { NextRequest, NextResponse } from 'next/server'
import { bookingController } from '@/lib/controllers/booking.controller'

export async function GET() {
  const result = await bookingController.list()
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const result = await bookingController.create(body)
  return NextResponse.json(result, { status: result.status || 200 })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const result = await bookingController.update(body.id, body.status)
  return NextResponse.json(result, { status: result.status || 200 })
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const result = await bookingController.remove(id!)
  return NextResponse.json(result, { status: result.status || 200 })
}