'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { MaintenanceEvent } from '@/lib/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface CostChartProps {
  events: MaintenanceEvent[]
}

function getLast12Months(): { label: string; key: string }[] {
  const months = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
    })
  }
  return months
}

export default function CostChart({ events }: CostChartProps) {
  const months = getLast12Months()

  // Aggregate costs by month
  const costByMonth: Record<string, number> = {}
  for (const m of months) {
    costByMonth[m.key] = 0
  }
  for (const event of events) {
    const key = event.event_date.slice(0, 7) // "YYYY-MM"
    if (key in costByMonth) {
      costByMonth[key] += Number(event.invoice_total)
    }
  }

  const labels = months.map((m) => m.label)
  const dataPoints = months.map((m) => costByMonth[m.key])

  const data = {
    labels,
    datasets: [
      {
        label: 'Maintenance Cost',
        data: dataPoints,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#1E293B',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E293B',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#94A3B8',
        bodyColor: '#F1F5F9',
        padding: 10,
        callbacks: {
          label: (ctx: any) =>
            ` $${Number(ctx.raw).toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51,65,85,0.4)' },
        ticks: { color: '#94A3B8', font: { size: 11 } },
        border: { color: '#334155' },
      },
      y: {
        grid: { color: 'rgba(51,65,85,0.4)' },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 },
          callback: (value: any) => '$' + Number(value).toLocaleString(),
        },
        border: { color: '#334155' },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="h-64">
      <Line data={data} options={options as any} />
    </div>
  )
}
