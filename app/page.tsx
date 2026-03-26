import Link from 'next/link'
import TruckCard from '@/components/TruckCard'
import { MOCK_TRUCKS, MOCK_MAINTENANCE_EVENTS } from '@/lib/mock-data'

function getTrucksWithCosts() {
  const costMap: Record<string, number> = {}
  for (const e of MOCK_MAINTENANCE_EVENTS) {
    costMap[e.unit_id] = (costMap[e.unit_id] ?? 0) + Number(e.invoice_total)
  }
  return MOCK_TRUCKS.map((truck) => ({
    truck,
    totalCost: costMap[truck.unit_id] ?? 0,
  }))
}

export default function DashboardPage() {
  const trucksWithCosts = getTrucksWithCosts()

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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {trucksWithCosts.map(({ truck, totalCost }) => (
          <TruckCard key={truck.id} truck={truck} totalCost={totalCost} />
        ))}
      </div>
    </div>
  )
}
