import { NextRequest, NextResponse } from 'next/server'
import { locationController } from '@/lib/controllers/location.controller'

export function GET() {
  return NextResponse.json(locationController.list())
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const result = await locationController.create(body)
  return NextResponse.json(result, { status: result.status || 200 })
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const result = await locationController.remove(id)
  return NextResponse.json(result, { status: result.status || 200 })
}