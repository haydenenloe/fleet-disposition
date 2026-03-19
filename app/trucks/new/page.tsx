'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function NewTruckPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    unit_id: '',
    vin: '',
    make: '',
    model: '',
    year: '',
    engine_type: '',
    purchase_date: '',
    purchase_price: '',
    odometer_at_purchase: '',
    current_odometer: '',
    warranty_expiry_mileage: '',
    warranty_expiry_date: '',
    eld_platform: '',
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
      unit_id: form.unit_id.trim(),
      make: form.make.trim(),
      model: form.model.trim(),
      year: parseInt(form.year),
      current_odometer: form.current_odometer ? parseInt(form.current_odometer) : null,
    }

    if (form.vin) payload.vin = form.vin.trim()
    if (form.engine_type) payload.engine_type = form.engine_type
    if (form.purchase_date) payload.purchase_date = form.purchase_date
    if (form.purchase_price) payload.purchase_price = parseFloat(form.purchase_price)
    if (form.odometer_at_purchase) payload.odometer_at_purchase = parseInt(form.odometer_at_purchase)
    if (form.warranty_expiry_mileage) payload.warranty_expiry_mileage = parseInt(form.warranty_expiry_mileage)
    if (form.warranty_expiry_date) payload.warranty_expiry_date = form.warranty_expiry_date
    if (form.eld_platform) payload.eld_platform = form.eld_platform
    if (form.notes) payload.notes = form.notes.trim()

    const { error: insertError } = await supabase.from('fleet_trucks').insert(payload)

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push(`/trucks/${encodeURIComponent(form.unit_id.trim())}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-[#94A3B8] hover:text-[#F1F5F9] text-sm flex items-center gap-1.5 mb-4 transition-colors w-fit">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Fleet
        </Link>
        <h1 className="text-3xl font-bold text-[#F1F5F9]">Add New Truck</h1>
        <p className="text-[#94A3B8] mt-1">Enter your truck details to start tracking maintenance costs.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-6">
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Identification */}
        <div>
          <h2 className="text-[#F1F5F9] font-semibold mb-4 pb-2 border-b border-[#334155]">
            Identification
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Unit ID *</label>
              <input
                name="unit_id"
                value={form.unit_id}
                onChange={handleChange}
                required
                placeholder="TRK-047"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">VIN</label>
              <input
                name="vin"
                value={form.vin}
                onChange={handleChange}
                placeholder="1FUJGLDV8CLBF5432"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div>
          <h2 className="text-[#F1F5F9] font-semibold mb-4 pb-2 border-b border-[#334155]">
            Vehicle Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="form-label">Make *</label>
              <input
                name="make"
                value={form.make}
                onChange={handleChange}
                required
                placeholder="Freightliner"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Model *</label>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                required
                placeholder="Cascadia"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Year *</label>
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
                min={1990}
                max={2030}
                placeholder="2019"
                className="form-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Engine Type</label>
              <select name="engine_type" value={form.engine_type} onChange={handleChange} className="form-input">
                <option value="">Select engine...</option>
                <option value="Cummins">Cummins</option>
                <option value="Detroit">Detroit</option>
                <option value="Paccar">Paccar</option>
                <option value="Caterpillar">Caterpillar</option>
                <option value="Volvo">Volvo</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">ELD Platform</label>
              <select name="eld_platform" value={form.eld_platform} onChange={handleChange} className="form-input">
                <option value="">Select platform...</option>
                <option value="Samsara">Samsara</option>
                <option value="Motive">Motive</option>
                <option value="Geotab">Geotab</option>
                <option value="Other">Other</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>
        </div>

        {/* Purchase Info */}
        <div>
          <h2 className="text-[#F1F5F9] font-semibold mb-4 pb-2 border-b border-[#334155]">
            Purchase Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label">Purchase Date</label>
              <input
                name="purchase_date"
                type="date"
                value={form.purchase_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Purchase Price ($)</label>
              <input
                name="purchase_price"
                type="number"
                value={form.purchase_price}
                onChange={handleChange}
                min={0}
                placeholder="85000"
                className="form-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Odometer at Purchase (mi)</label>
              <input
                name="odometer_at_purchase"
                type="number"
                value={form.odometer_at_purchase}
                onChange={handleChange}
                min={0}
                placeholder="450000"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Current Odometer (mi) *</label>
              <input
                name="current_odometer"
                type="number"
                value={form.current_odometer}
                onChange={handleChange}
                required
                min={0}
                placeholder="512000"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Warranty */}
        <div>
          <h2 className="text-[#F1F5F9] font-semibold mb-4 pb-2 border-b border-[#334155]">
            Warranty
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Warranty Expiry Mileage</label>
              <input
                name="warranty_expiry_mileage"
                type="number"
                value={form.warranty_expiry_mileage}
                onChange={handleChange}
                min={0}
                placeholder="600000"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Warranty Expiry Date</label>
              <input
                name="warranty_expiry_date"
                type="date"
                value={form.warranty_expiry_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any additional notes about this truck..."
            className="form-input resize-none"
          />
        </div>

        {/* Actions */}
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
              'Save Truck'
            )}
          </button>
          <Link href="/" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
