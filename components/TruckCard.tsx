import Link from 'next/link'
import type { Truck, MaintenanceEvent } from '@/lib/types'

interface TruckCardProps {
  truck: Truck
  totalCost?: number
}

export default function TruckCard({ truck, totalCost = 0 }: TruckCardProps) {
  return (
    <div className="card p-6 hover:border-[#3B82F6] transition-colors duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-block bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-bold px-2.5 py-1 rounded-md mb-2">
            {truck.unit_id}
          </span>
          <h3 className="text-[#F1F5F9] font-semibold text-lg leading-tight">
            {truck.year} {truck.make} {truck.model}
          </h3>
          {truck.engine_type && (
            <p className="text-[#94A3B8] text-sm mt-0.5">{truck.engine_type} Engine</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0F172A] rounded-lg p-3">
          <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wide mb-1">Odometer</p>
          <p className="text-[#F1F5F9] font-semibold">
            {truck.current_odometer != null
              ? truck.current_odometer.toLocaleString() + ' mi'
              : '—'}
          </p>
        </div>
        <div className="bg-[#0F172A] rounded-lg p-3">
          <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wide mb-1">Total Maint.</p>
          <p className="text-[#F59E0B] font-semibold">
            ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Footer */}
      <Link
        href={`/trucks/${encodeURIComponent(truck.unit_id)}`}
        className="mt-auto flex items-center justify-between text-[#3B82F6] hover:text-blue-400 text-sm font-medium transition-colors group"
      >
        <span>View Details</span>
        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}
