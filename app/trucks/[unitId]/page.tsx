import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CostChart from '@/components/CostChart'
import type { Truck, MaintenanceEvent } from '@/lib/types'

async function getTruck(unitId: string): Promise<Truck | null> {
  const { data, error } = await supabase
    .from('fleet_trucks')
    .select('*')
    .eq('unit_id', unitId)
    .single()
  if (error || !data) return null
  return data as Truck
}

async function getMaintenanceEvents(unitId: string): Promise<MaintenanceEvent[]> {
  const { data, error } = await supabase
    .from('fleet_maintenance_events')
    .select('*')
    .eq('unit_id', unitId)
    .order('event_date', { ascending: false })
  if (error || !data) return []
  return data as MaintenanceEvent[]
}

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function calcAvgCostPerMonth(events: MaintenanceEvent[]): string {
  if (events.length === 0) return '$0'
  const total = events.reduce((s, e) => s + Number(e.invoice_total), 0)
  const dates = events.map((e) => new Date(e.event_date).getTime())
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)
  const months = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24 * 30))
  return '$' + (total / months).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default async function TruckDetailPage({
  params,
}: {
  params: { unitId: string }
}) {
  const unitId = decodeURIComponent(params.unitId)
  const [truck, events] = await Promise.all([getTruck(unitId), getMaintenanceEvents(unitId)])

  if (!truck) notFound()

  const totalCost = events.reduce((s, e) => s + Number(e.invoice_total), 0)
  const avgCostPerMonth = calcAvgCostPerMonth(events)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link href="/" className="text-[#94A3B8] hover:text-[#F1F5F9] text-sm flex items-center gap-1.5 mb-3 transition-colors w-fit">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Fleet
          </Link>
          <h1 className="text-3xl font-bold text-[#F1F5F9]">
            {truck.unit_id} — {truck.year} {truck.make} {truck.model}
          </h1>
          {truck.engine_type && (
            <p className="text-[#94A3B8] mt-1">{truck.engine_type} Engine</p>
          )}
        </div>
        <Link
          href={`/trucks/${encodeURIComponent(unitId)}/analysis`}
          className="btn-primary flex items-center gap-2 whitespace-nowrap self-start"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Run Analysis
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Current Odometer',
            value: truck.current_odometer != null
              ? truck.current_odometer.toLocaleString() + ' mi'
              : '—',
          },
          {
            label: 'Total Maintenance Cost',
            value: formatCurrency(totalCost),
            highlight: 'warning',
          },
          {
            label: 'Events Logged',
            value: events.length.toString(),
          },
          {
            label: 'Avg Cost / Month',
            value: avgCostPerMonth,
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wide mb-1.5">
              {stat.label}
            </p>
            <p className={`text-xl font-bold ${stat.highlight === 'warning' ? 'text-[#F59E0B]' : 'text-[#F1F5F9]'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Cost Chart */}
      <div className="card p-6">
        <h2 className="text-[#F1F5F9] font-semibold mb-6 flex items-center justify-between">
          Monthly Maintenance Costs
          <span className="text-[#94A3B8] text-sm font-normal">Last 12 months</span>
        </h2>
        <CostChart events={events} />
      </div>

      {/* Maintenance History */}
      <div className="card">
        <div className="flex items-center justify-between p-6 border-b border-[#334155]">
          <h2 className="text-[#F1F5F9] font-semibold">Maintenance History</h2>
          <Link
            href={`/trucks/${encodeURIComponent(unitId)}/maintenance/new`}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-[#94A3B8] mb-4">No maintenance events yet.</p>
            <Link
              href={`/trucks/${encodeURIComponent(unitId)}/maintenance/new`}
              className="text-[#3B82F6] hover:text-blue-400 text-sm font-medium transition-colors"
            >
              Log the first one →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#334155]">
                  {['Date', 'Shop', 'Category', 'Amount', 'Mileage', 'Notes'].map((h) => (
                    <th key={h} className="text-left text-[#94A3B8] font-medium px-6 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((event, idx) => (
                  <tr
                    key={event.id}
                    className={`border-b border-[#334155]/50 hover:bg-[#0F172A]/50 transition-colors ${
                      idx === events.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-3.5 text-[#F1F5F9] whitespace-nowrap">
                      {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-[#94A3B8]">{event.shop_name || '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className="bg-[#0F172A] text-[#94A3B8] px-2 py-0.5 rounded text-xs">
                        {event.repair_category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-[#F59E0B] font-medium whitespace-nowrap">
                      {formatCurrency(Number(event.invoice_total))}
                    </td>
                    <td className="px-6 py-3.5 text-[#94A3B8] whitespace-nowrap">
                      {event.mileage_at_repair != null
                        ? event.mileage_at_repair.toLocaleString() + ' mi'
                        : '—'}
                    </td>
                    <td className="px-6 py-3.5 text-[#94A3B8] max-w-xs truncate">
                      {event.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#334155] bg-[#0F172A]/40">
                  <td colSpan={3} className="px-6 py-3 text-[#94A3B8] text-xs font-medium uppercase tracking-wide">
                    Total ({events.length} events)
                  </td>
                  <td className="px-6 py-3 text-[#F59E0B] font-bold">
                    {formatCurrency(totalCost)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
