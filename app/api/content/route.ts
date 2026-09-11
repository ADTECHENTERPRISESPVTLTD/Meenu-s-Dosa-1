import { NextRequest, NextResponse } from 'next/server'
import { contentController } from '@/lib/controllers/content.controller'

export function GET() {
  return NextResponse.json(contentController.get())
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const result = await contentController.save(body)
  return NextResponse.json(result)
}