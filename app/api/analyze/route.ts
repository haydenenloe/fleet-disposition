import { NextRequest, NextResponse } from 'next/server'
import { MOCK_ANALYSIS } from '@/lib/mock-data'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { unitId } = body as { unitId: string; marketValue?: number }

    if (!unitId) {
      return NextResponse.json({ error: 'unitId is required' }, { status: 400 })
    }

    const result = MOCK_ANALYSIS[unitId]

    if (!result) {
      return NextResponse.json(
        { error: `No analysis available for unit ${unitId}` },
        { status: 404 }
      )
    }

    // Simulate a slight delay so the loading state shows (feels more real)
    await new Promise((r) => setTimeout(r, 800))

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Analyze route error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
