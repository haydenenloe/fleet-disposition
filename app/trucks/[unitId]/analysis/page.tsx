'use client'

import { useState } from 'react'
import Link from 'next/link'

interface DataUsed {
  unitId: string
  vehicle: string
  ageMonths: number
  currentMileage: number | null
  totalMaintenanceCost: number
  last90DayCost: number
  prior90DayCost: number
  warrantyStatus: string
  marketValue: number
  eventCount: number
}

interface AnalysisResult {
  recommendation: string
  dataUsed: DataUsed
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[#94A3B8] text-xs font-medium uppercase tracking-wide">{label}</span>
      <span className="text-[#F1F5F9] font-medium">{value}</span>
    </div>
  )
}

export default function AnalysisPage({
  params,
}: {
  params: { unitId: string }
}) {
  const unitId = decodeURIComponent(params.unitId)
  const [marketValue, setMarketValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runAnalysis = async () => {
    if (!marketValue || parseFloat(marketValue) <= 0) {
      setError('Please enter a valid market resale value.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId, marketValue: parseFloat(marketValue) }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (n: number) =>
    '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="max-w-3xl mx-auto">
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
        <h1 className="text-3xl font-bold text-[#F1F5F9]">
          Disposition Analysis
        </h1>
        <p className="text-[#94A3B8] mt-1">
          AI-powered hold/sell recommendation for{' '}
          <span className="text-[#3B82F6] font-medium">{unitId}</span>
        </p>
      </div>

      {/* Market Value Input */}
      <div className="card p-6 mb-6">
        <label className="block text-[#F1F5F9] font-semibold mb-1.5">
          Current Estimated Resale Value
        </label>
        <p className="text-[#94A3B8] text-sm mb-4">
          Enter current market value from TruckPaper, Commercial Truck Trader, or a dealer quote.
        </p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] font-medium">$</span>
            <input
              type="number"
              value={marketValue}
              onChange={(e) => setMarketValue(e.target.value)}
              placeholder="45000"
              min={0}
              className="form-input pl-8"
              disabled={loading}
            />
          </div>
          <button
            onClick={runAnalysis}
            disabled={loading || !marketValue}
            className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#334155]"></div>
            <div className="w-16 h-16 rounded-full border-4 border-[#3B82F6] border-t-transparent animate-spin absolute inset-0"></div>
          </div>
          <div>
            <p className="text-[#F1F5F9] font-semibold">Analyzing your fleet data with Claude...</p>
            <p className="text-[#94A3B8] text-sm mt-1">This usually takes 5–10 seconds</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="flex flex-col gap-6">
          {/* Recommendation */}
          <div className="card p-6 border-l-4 border-l-[#3B82F6]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-[#F1F5F9] font-semibold">Claude's Recommendation</h2>
            </div>
            <p className="text-[#F1F5F9] leading-relaxed whitespace-pre-wrap">
              {result.recommendation}
            </p>
          </div>

          {/* Data Used */}
          <div className="card p-6">
            <h3 className="text-[#F1F5F9] font-semibold mb-5 pb-3 border-b border-[#334155]">
              Data Used in This Analysis
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
              <StatRow label="Unit ID" value={result.dataUsed.unitId} />
              <StatRow label="Vehicle" value={result.dataUsed.vehicle} />
              <StatRow label="Age" value={`${result.dataUsed.ageMonths} months`} />
              <StatRow
                label="Current Mileage"
                value={
                  result.dataUsed.currentMileage != null
                    ? result.dataUsed.currentMileage.toLocaleString() + ' mi'
                    : '—'
                }
              />
              <StatRow
                label="Total Maint. Cost"
                value={formatCurrency(result.dataUsed.totalMaintenanceCost)}
              />
              <StatRow label="Events Logged" value={result.dataUsed.eventCount.toString()} />
              <StatRow
                label="Cost — Last 90 Days"
                value={formatCurrency(result.dataUsed.last90DayCost)}
              />
              <StatRow
                label="Cost — Prior 90 Days"
                value={formatCurrency(result.dataUsed.prior90DayCost)}
              />
              <StatRow label="Warranty Status" value={result.dataUsed.warrantyStatus} />
              <StatRow
                label="Market Value"
                value={formatCurrency(result.dataUsed.marketValue)}
              />
            </div>
          </div>

          {/* Re-run */}
          <p className="text-[#94A3B8] text-sm text-center">
            Want to re-run with a different market value?{' '}
            <button
              onClick={() => setResult(null)}
              className="text-[#3B82F6] hover:text-blue-400 transition-colors"
            >
              Update value
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
