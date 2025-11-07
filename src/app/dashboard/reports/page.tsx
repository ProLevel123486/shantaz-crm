"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  Download
} from "lucide-react"

interface DashboardStats {
  totalLeads: number
  totalDeals: number
  totalRevenue: number
  totalContracts: number
  activeInstallations: number
  inventoryValue: number
  pendingServiceRequests: number
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("THIS_MONTH")

  useEffect(() => {
    fetchStats()
  }, [dateRange])

  const fetchStats = async () => {
    try {
      // In a real app, this would fetch from an analytics API
      setStats({
        totalLeads: 156,
        totalDeals: 42,
        totalRevenue: 2450000,
        totalContracts: 28,
        activeInstallations: 15,
        inventoryValue: 850000,
        pendingServiceRequests: 23,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: string) => {
    console.log(`Exporting report as ${format}`)
    alert(`Export functionality will be implemented for ${format} format`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="TODAY">Today</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="THIS_QUARTER">This Quarter</option>
            <option value="THIS_YEAR">This Year</option>
            <option value="CUSTOM">Custom Range</option>
          </select>
          <button
            onClick={() => exportReport("PDF")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading analytics...</div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats?.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">↑ 12.5% from last month</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalLeads}</p>
                  <p className="text-xs text-green-600 mt-1">↑ 8.2% from last month</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Deals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalDeals}</p>
                  <p className="text-xs text-yellow-600 mt-1">→ No change</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalContracts}</p>
                  <p className="text-xs text-green-600 mt-1">↑ 3 new this month</p>
                </div>
                <FileText className="h-12 w-12 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Installations</h3>
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.activeInstallations}</p>
              <p className="text-sm text-gray-500 mt-1">Currently in progress</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Inventory Value</h3>
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{stats?.inventoryValue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Total stock value</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Service Requests</h3>
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.pendingServiceRequests}</p>
              <p className="text-sm text-gray-500 mt-1">Pending requests</p>
            </div>
          </div>

          {/* Charts Placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Sales Pipeline</h3>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded">
                Sales Pipeline Chart (Chart.js/Recharts integration)
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Revenue by Category</h3>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded">
                Revenue Distribution Chart (Chart.js/Recharts integration)
              </div>
            </div>
          </div>

          {/* Lead Source Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Lead Sources</h3>
            <div className="space-y-3">
              {[
                { source: "Website", count: 65, percentage: 42 },
                { source: "Referral", count: 42, percentage: 27 },
                { source: "Social Media", count: 28, percentage: 18 },
                { source: "Phone", count: 15, percentage: 10 },
                { source: "Other", count: 6, percentage: 3 },
              ].map((item) => (
                <div key={item.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.source}</span>
                    <span className="text-gray-600">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Export Reports</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => exportReport("PDF")}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Export as PDF
              </button>
              <button
                onClick={() => exportReport("Excel")}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Export as Excel
              </button>
              <button
                onClick={() => exportReport("CSV")}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Export as CSV
              </button>
              <button
                onClick={() => exportReport("JSON")}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Export as JSON
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
