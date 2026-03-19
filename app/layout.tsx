import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fleet Disposition Intelligence',
  description: 'AI-powered hold/sell recommendations for trucking operators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0F172A] text-[#F1F5F9]">
        {/* Top Navigation */}
        <nav className="border-b border-[#334155] bg-[#0F172A] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h9zM13 8h4l3 3v5h-7V8z" />
                  </svg>
                </div>
                <span className="text-[#F1F5F9] font-bold text-lg tracking-tight">
                  Fleet Intelligence
                </span>
              </Link>

              {/* Nav Links */}
              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  className="text-[#94A3B8] hover:text-[#F1F5F9] px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#1E293B]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/trucks/new"
                  className="bg-[#3B82F6] hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Truck
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
