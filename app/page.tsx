import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import TruckCard from '@/components/TruckCard'
import type { Truck, MaintenanceEvent } from '@/lib/types'

async function getTrucksWithCosts(): Promise<{ truck: Truck; totalCost: number }[]> {
  try {
    const { data: trucks, error: truckError } = await supabase
      .from('fleet_trucks')
      .select('*')
      .order('created_at', { ascending: false })

    if (truckError) throw truckError
    if (!trucks || trucks.length === 0) return []

    const { data: events, error: eventError } = await supabase
      .from('fleet_maintenance_events')
      .select('unit_id, invoice_total')

    if (eventError) throw eventError

    const costMap: Record<string, number> = {}
    for (const e of events ?? []) {
      costMap[e.unit_id] = (costMap[e.unit_id] ?? 0) + Number(e.invoice_total)
    }

    return trucks.map((truck) => ({
      truck: truck as Truck,
      totalCost: costMap[truck.unit_id] ?? 0,
    }))
  } catch (err) {
    console.error('Error fetching trucks:', err)
    return []
  }
}

export default async function DashboardPage() {
  const trucksWithCosts = await getTrucksWithCosts()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#F1F5F9]">Your Fleet</h1>
          <p className="text-[#94A3B8] mt-1">
            {trucksWithCosts.length} truck{trucksWithCosts.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <Link href="/trucks/new" className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Truck
        </Link>
      </div>

      {/* Grid or Empty State */}
      {trucksWithCosts.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h9zM13 8h4l3 3v5h-7V8z" />
            </svg>
          </div>
          <h2 className="text-[#F1F5F9] text-xl font-semibold mb-2">No trucks yet</h2>
          <p className="text-[#94A3B8] mb-6 max-w-sm">
            Start tracking your fleet's maintenance costs to unlock AI-powered hold/sell recommendations.
          </p>
          <Link href="/trucks/new" className="btn-primary">
            Add your first truck →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trucksWithCosts.map(({ truck, totalCost }) => (
            <TruckCard key={truck.id} truck={truck} totalCost={totalCost} />
          ))}
        </div>
      )}
    </div>
  )
}
