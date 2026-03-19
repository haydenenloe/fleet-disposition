import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import type { Truck, MaintenanceEvent } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Use service role if available, fall back to anon
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

function ageInMonths(purchaseDate: string | null, year: number): number {
  if (purchaseDate) {
    const purchased = new Date(purchaseDate)
    const now = new Date()
    return Math.floor(
      (now.getTime() - purchased.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    )
  }
  // Fallback: estimate from year
  const now = new Date()
  return (now.getFullYear() - year) * 12 + now.getMonth()
}

function sumCostInRange(
  events: MaintenanceEvent[],
  daysStart: number,
  daysEnd: number
): number {
  const now = new Date()
  const start = new Date(now.getTime() - daysEnd * 86400000)
  const end = new Date(now.getTime() - daysStart * 86400000)
  return events
    .filter((e) => {
      const d = new Date(e.event_date)
      return d >= start && d <= end
    })
    .reduce((s, e) => s + Number(e.invoice_total), 0)
}

function warrantyStatus(truck: Truck): string {
  const now = new Date()
  const parts: string[] = []

  if (truck.warranty_expiry_date) {
    const expDate = new Date(truck.warranty_expiry_date)
    if (expDate > now) {
      parts.push(`Date warranty active until ${expDate.toLocaleDateString()}`)
    } else {
      parts.push(`Date warranty expired ${expDate.toLocaleDateString()}`)
    }
  }

  if (truck.warranty_expiry_mileage != null && truck.current_odometer != null) {
    if (truck.current_odometer < truck.warranty_expiry_mileage) {
      parts.push(
        `Mileage warranty active (${truck.current_odometer.toLocaleString()} / ${truck.warranty_expiry_mileage.toLocaleString()} mi)`
      )
    } else {
      parts.push(
        `Mileage warranty expired at ${truck.warranty_expiry_mileage.toLocaleString()} mi`
      )
    }
  }

  return parts.length > 0 ? parts.join('; ') : 'No warranty data on file'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { unitId, marketValue } = body as { unitId: string; marketValue: number }

    if (!unitId || !marketValue) {
      return NextResponse.json({ error: 'unitId and marketValue are required' }, { status: 400 })
    }

    const supabase = getSupabaseServer()

    // Fetch truck
    const { data: truckData, error: truckError } = await supabase
      .from('fleet_trucks')
      .select('*')
      .eq('unit_id', unitId)
      .single()

    if (truckError || !truckData) {
      return NextResponse.json({ error: 'Truck not found' }, { status: 404 })
    }

    const truck = truckData as Truck

    // Fetch all maintenance events
    const { data: eventsData, error: eventsError } = await supabase
      .from('fleet_maintenance_events')
      .select('*')
      .eq('unit_id', unitId)
      .order('event_date', { ascending: false })

    if (eventsError) {
      return NextResponse.json({ error: 'Failed to fetch maintenance events' }, { status: 500 })
    }

    const events = (eventsData ?? []) as MaintenanceEvent[]

    // Compute metrics
    const ageMonths = ageInMonths(truck.purchase_date, truck.year)
    const totalCost = events.reduce((s, e) => s + Number(e.invoice_total), 0)
    const last90Cost = sumCostInRange(events, 0, 90)
    const prior90Cost = sumCostInRange(events, 91, 180)
    const escalationPct =
      prior90Cost > 0
        ? (((last90Cost - prior90Cost) / prior90Cost) * 100).toFixed(1)
        : last90Cost > 0
        ? '100'
        : '0'
    const escalationDir = Number(escalationPct) >= 0 ? 'increase' : 'decrease'
    const warrantyStr = warrantyStatus(truck)

    // Recent 5 events
    const recentEvents = events.slice(0, 5)
    const recentList = recentEvents
      .map(
        (e) =>
          `  - ${e.event_date}: ${e.repair_category} — $${Number(e.invoice_total).toFixed(2)}${
            e.shop_name ? ` @ ${e.shop_name}` : ''
          }${e.notes ? ` (${e.notes})` : ''}`
      )
      .join('\n')

    const userMessage = `Fleet Disposition Analysis Request:

Unit: ${truck.unit_id}
Vehicle: ${truck.year} ${truck.make} ${truck.model}
Engine: ${truck.engine_type ?? 'Unknown'}
Current Mileage: ${truck.current_odometer != null ? truck.current_odometer.toLocaleString() : 'Unknown'} miles
Age: ${ageMonths} months
Purchase Price: $${truck.purchase_price != null ? Number(truck.purchase_price).toFixed(2) : 'Unknown'}

Maintenance History:
- Total cost to date: $${totalCost.toFixed(2)}
- Maintenance events: ${events.length}
- Cost last 90 days: $${last90Cost.toFixed(2)}
- Cost prior 90 days: $${prior90Cost.toFixed(2)}
- Escalation trend: ${Math.abs(Number(escalationPct))}% ${escalationDir}

Warranty Status: ${warrantyStr}

Current Market Resale Value (operator estimate): $${marketValue.toFixed(2)}

Recent Maintenance Events (last 5):
${recentList || '  No events recorded'}
`

    // Call Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system:
        'You are a fleet disposition intelligence agent for small trucking operators. You analyze a truck\'s maintenance cost history, current mileage, age, and market conditions to generate a clear hold/sell recommendation. Always express your reasoning in plain language a truck operator would understand. Always include a dollar estimate of what it is costing the operator per month to continue holding this truck. Always include a recommended action window in days.',
      messages: [{ role: 'user', content: userMessage }],
    })

    const recommendation =
      message.content[0].type === 'text' ? message.content[0].text : ''

    const dataUsed = {
      unitId: truck.unit_id,
      vehicle: `${truck.year} ${truck.make} ${truck.model}`,
      ageMonths,
      currentMileage: truck.current_odometer,
      totalMaintenanceCost: totalCost,
      last90DayCost: last90Cost,
      prior90DayCost: prior90Cost,
      warrantyStatus: warrantyStr,
      marketValue,
      eventCount: events.length,
    }

    return NextResponse.json({ recommendation, dataUsed })
  } catch (err: any) {
    console.error('Analyze route error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
