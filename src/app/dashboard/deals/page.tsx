"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Eye, Edit, DollarSign, User, Building } from "lucide-react"
import Link from "next/link"

interface Deal {
  id: string
  title: string
  value: number
  stage: string
  probability: number
  expectedCloseDate: string
  contact: { id: string; name: string } | null
  account: { id: string; name: string } | null
  assignedTo: { name: string } | null
  createdAt: string
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("ALL")

  useEffect(() => {
    fetchDeals()
  }, [stageFilter])

  const fetchDeals = async () => {
    try {
      const params = new URLSearchParams()
      if (stageFilter !== "ALL") params.append("stage", stageFilter)
      
      const response = await fetch(`/api/deals?${params}`)
      const data = await response.json()
      setDeals(data)
    } catch (error) {
      console.error("Error fetching deals:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      PROSPECTING: "bg-gray-100 text-gray-800",
      QUALIFICATION: "bg-blue-100 text-blue-800",
      PROPOSAL: "bg-yellow-100 text-yellow-800",
      NEGOTIATION: "bg-orange-100 text-orange-800",
      CLOSED_WON: "bg-green-100 text-green-800",
      CLOSED_LOST: "bg-red-100 text-red-800",
    }
    return colors[stage] || "bg-gray-100 text-gray-800"
  }

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0)
  const avgProbability = filteredDeals.length > 0
    ? filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / filteredDeals.length
    : 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage your sales pipeline</p>
        </div>
        <Link
          href="/dashboard/deals/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          New Deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-12 w-12 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">{filteredDeals.length}</p>
            </div>
            <Building className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Probability</p>
              <p className="text-2xl font-bold text-gray-900">{avgProbability.toFixed(0)}%</p>
            </div>
            <User className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Stages</option>
            <option value="PROSPECTING">Prospecting</option>
            <option value="QUALIFICATION">Qualification</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="CLOSED_WON">Closed Won</option>
            <option value="CLOSED_LOST">Closed Lost</option>
          </select>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : filteredDeals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No deals found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact/Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Close Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{deal.title}</div>
                      <div className="text-xs text-gray-500">by {deal.assignedTo?.name || "Unassigned"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{deal.value.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                        {deal.stage.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{deal.contact?.name || "-"}</div>
                      <div className="text-xs text-gray-500">{deal.account?.name || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link
                          href={`/deals/${deal.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/deals/${deal.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
