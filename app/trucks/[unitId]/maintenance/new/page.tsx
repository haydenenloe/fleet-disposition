'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function NewMaintenanceEventPage({
  params,
}: {
  params: { unitId: string }
}) {
  const unitId = decodeURIComponent(params.unitId)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  const [form, setForm] = useState({
    event_date: today,
    shop_name: '',
    invoice_total: '',
    repair_category: '',
    mileage_at_repair: '',
    notes: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload: Record<string, any> = {
      unit_id: unitId,
      event_date: form.event_date,
      invoice_total: parseFloat(form.invoice_total),
      repair_category: form.repair_category,
    }

    if (form.shop_name) payload.shop_name = form.shop_name.trim()
    if (form.mileage_at_repair) payload.mileage_at_repair = parseInt(form.mileage_at_repair)
    if (form.notes) payload.notes = form.notes.trim()

    const { error: insertError } = await supabase
      .from('fleet_maintenance_events')
      .insert(payload)

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push(`/trucks/${encodeURIComponent(unitId)}`)
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/trucks/${encodeURIComponent(unitId)}`}
          className="text-[#94A3B8] hover:text-[#F1F5F9] text-sm flex items-center gap-1.5 mb-4 transition-colors w-fit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {unitId}
        </Link>
        <h1 className="text-3xl font-bold text-[#F1F5F9]">Log Maintenance Event</h1>
        <p className="text-[#94A3B8] mt-1">
          Recording event for <span className="text-[#3B82F6] font-medium">{unitId}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5">
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Date *</label>
            <input
              name="event_date"
              type="date"
              value={form.event_date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Mileage at Repair</label>
            <input
              name="mileage_at_repair"
              type="number"
              value={form.mileage_at_repair}
              onChange={handleChange}
              min={0}
              placeholder="512000"
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="form-label">Shop Name</label>
          <input
            name="shop_name"
            value={form.shop_name}
            onChange={handleChange}
            placeholder="Pete's Diesel Repair"
            className="form-input"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Invoice Total ($) *</label>
            <input
              name="invoice_total"
              type="number"
              value={form.invoice_total}
              onChange={handleChange}
              required
              min={0}
              step="0.01"
              placeholder="1250.00"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Repair Category *</label>
            <select
              name="repair_category"
              value={form.repair_category}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select category...</option>
              <option value="Engine">Engine</option>
              <option value="Transmission">Transmission</option>
              <option value="Brakes">Brakes</option>
              <option value="Electrical">Electrical</option>
              <option value="Tires">Tires</option>
              <option value="Scheduled Maintenance">Scheduled Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Details about the repair, parts replaced, etc."
            className="form-input resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save Event'
            )}
          </button>
          <Link href={`/trucks/${encodeURIComponent(unitId)}`} className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
