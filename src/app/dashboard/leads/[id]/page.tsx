"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, Calendar, User, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  source: string
  status: string
  value: number
  notes: string
  assignedTo: { name: string; email: string } | null
  createdBy: { name: string } | null
  createdAt: string
  updatedAt: string
  activities: Array<{
    id: string
    type: string
    description: string
    createdAt: string
    createdBy: { name: string }
  }>
  comments: Array<{
    id: string
    content: string
    createdAt: string
    createdBy: { name: string }
  }>
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    fetchLead()
  }, [params.id])

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/leads/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setLead(data)
      }
    } catch (error) {
      console.error("Error fetching lead:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead?")) return

    try {
      const response = await fetch(`/api/leads/${params.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        router.push("/leads")
      }
    } catch (error) {
      console.error("Error deleting lead:", error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/leads/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })
      if (response.ok) {
        setNewComment("")
        fetchLead()
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!lead) {
    return <div className="p-6">Lead not found</div>
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-100 text-blue-800",
      CONTACTED: "bg-yellow-100 text-yellow-800",
      QUALIFIED: "bg-purple-100 text-purple-800",
      CONVERTED: "bg-green-100 text-green-800",
      LOST: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/leads" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-600 mt-1">{lead.company}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/leads/${lead.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Lead Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{lead.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{lead.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{lead.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{lead.position || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Source</p>
                  <p className="font-medium">{lead.source}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Estimated Value</p>
              <p className="text-2xl font-bold text-indigo-600">₹{lead.value.toLocaleString()}</p>
            </div>

            {lead.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Notes</p>
                <p className="text-gray-700">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Timeline</h2>
            <div className="space-y-4">
              {lead.activities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No activities yet</p>
              ) : (
                lead.activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-indigo-600 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.createdBy.name} • {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            
            <div className="space-y-4 mb-4">
              {lead.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <p className="text-gray-900">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.createdBy.name} • {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Assignment</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="font-medium">{lead.assignedTo?.name || "Unassigned"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="font-medium">{lead.createdBy?.name || "-"}</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Dates</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{new Date(lead.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
