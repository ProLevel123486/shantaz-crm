"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Eye, Calendar, Users, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

interface Installation {
  id: string
  installationNumber: string
  serviceRequest: { ticketNumber: string; title: string }
  scheduledDate: string
  status: string
  team: Array<{ name: string }>
  progress: number
  createdAt: string
}

export default function InstallationsPage() {
  const [installations, setInstallations] = useState<Installation[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    fetchInstallations()
  }, [statusFilter])

  const fetchInstallations = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "ALL") params.append("status", statusFilter)
      
      const response = await fetch(`/api/installations?${params}`)
      const data = await response.json()
      setInstallations(data)
    } catch (error) {
      console.error("Error fetching installations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      ON_HOLD: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const stats = {
    total: installations.length,
    scheduled: installations.filter(i => i.status === "SCHEDULED").length,
    inProgress: installations.filter(i => i.status === "IN_PROGRESS").length,
    completed: installations.filter(i => i.status === "COMPLETED").length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Installations</h1>
          <p className="text-gray-600 mt-1">Manage installation schedules and teams</p>
        </div>
        <Link
          href="/installations/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Schedule Installation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-12 w-12 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <Clock className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <Users className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
      </div>

      {/* Installations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center">Loading...</div>
        ) : installations.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">No installations found</div>
        ) : (
          installations.map((installation) => (
            <div key={installation.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-mono text-indigo-600 font-semibold">
                    {installation.installationNumber}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    SR: {installation.serviceRequest.ticketNumber}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(installation.status)}`}>
                  {installation.status.replace(/_/g, " ")}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-3">{installation.serviceRequest.title}</h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(installation.scheduledDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{installation.team.length} team member{installation.team.length !== 1 ? "s" : ""}</span>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{installation.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${installation.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <Link
                href={`/installations/${installation.id}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
