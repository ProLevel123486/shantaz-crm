"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ServiceRequest {
  id: string;
  ticketNumber: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  resolution: string;
  contact: { id: string; name: string; email: string; phone: string } | null;
  account: { id: string; name: string } | null;
  assignedTo: { id: string; name: string; email: string } | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export default function ServiceRequestDetailPage() {
  const params = useParams();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchServiceRequest();
    }
  }, [params.id]);

  const fetchServiceRequest = async () => {
    try {
      const response = await fetch(`/api/service-requests/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setServiceRequest(data);
      }
    } catch (error) {
      console.error("Error fetching service request:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/service-requests/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchServiceRequest();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800",
      ON_HOLD: "bg-orange-100 text-orange-800",
      RESOLVED: "bg-green-100 text-green-800",
      CLOSED: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-gray-100 text-gray-800",
      MEDIUM: "bg-blue-100 text-blue-800",
      HIGH: "bg-orange-100 text-orange-800",
      URGENT: "bg-red-100 text-red-800"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="p-8">Loading service request...</div>;
  }

  if (!serviceRequest) {
    return <div className="p-8">Service request not found</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{serviceRequest.ticketNumber}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(serviceRequest.status)}`}>
              {serviceRequest.status.replace(/_/g, " ")}
            </span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(serviceRequest.priority)}`}>
              {serviceRequest.priority}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Created {new Date(serviceRequest.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Edit
          </button>
          {serviceRequest.status !== "RESOLVED" && serviceRequest.status !== "CLOSED" && (
            <button
              onClick={() => updateStatus("RESOLVED")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Mark Resolved
            </button>
          )}
        </div>
      </div>

      {/* Status Workflow */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <h2 className="text-lg font-semibold mb-4">Status Workflow</h2>
        <div className="flex items-center gap-2">
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                serviceRequest.status === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="col-span-1 space-y-6">
          {/* Ticket Information */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Ticket Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Ticket #:</span>
                <span className="ml-2 font-medium">{serviceRequest.ticketNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="ml-2">{serviceRequest.category}</span>
              </div>
              <div>
                <span className="text-gray-600">Priority:</span>
                <span className="ml-2">{serviceRequest.priority}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2">{serviceRequest.status.replace(/_/g, " ")}</span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2">{new Date(serviceRequest.createdAt).toLocaleDateString()}</span>
              </div>
              {serviceRequest.resolvedAt && (
                <div>
                  <span className="text-gray-600">Resolved:</span>
                  <span className="ml-2">{new Date(serviceRequest.resolvedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3 text-sm">
              {serviceRequest.account && (
                <div>
                  <span className="text-gray-600">Account:</span>
                  <Link
                    href={`/dashboard/accounts/${serviceRequest.account.id}`}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {serviceRequest.account.name}
                  </Link>
                </div>
              )}
              {serviceRequest.contact && (
                <>
                  <div>
                    <span className="text-gray-600">Contact:</span>
                    <Link
                      href={`/dashboard/contacts/${serviceRequest.contact.id}`}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {serviceRequest.contact.name}
                    </Link>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <a
                      href={`mailto:${serviceRequest.contact.email}`}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      {serviceRequest.contact.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <a
                      href={`tel:${serviceRequest.contact.phone}`}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      {serviceRequest.contact.phone}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Assignment</h2>
            <div className="space-y-3 text-sm">
              {serviceRequest.assignedTo ? (
                <>
                  <div>
                    <span className="text-gray-600">Assigned To:</span>
                    <span className="ml-2 font-medium">{serviceRequest.assignedTo.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <a
                      href={`mailto:${serviceRequest.assignedTo.email}`}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      {serviceRequest.assignedTo.email}
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-gray-500">Not assigned</div>
              )}
              <div>
                <span className="text-gray-600">Created By:</span>
                <span className="ml-2">{serviceRequest.createdBy?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Description & Resolution */}
        <div className="col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Problem Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{serviceRequest.description}</p>
          </div>

          {/* Resolution */}
          {serviceRequest.resolution && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Resolution</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{serviceRequest.resolution}</p>
            </div>
          )}

          {/* Add Resolution */}
          {!serviceRequest.resolution && serviceRequest.status !== "CLOSED" && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Add Resolution</h2>
              <textarea
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
                placeholder="Describe the resolution..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Resolution
              </button>
            </div>
          )}

          {/* Activity Log */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">Ticket created</div>
                  <div className="text-xs text-gray-500">
                    {new Date(serviceRequest.createdAt).toLocaleString()} by {serviceRequest.createdBy?.name}
                  </div>
                </div>
              </div>
              {serviceRequest.resolvedAt && (
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">Ticket resolved</div>
                    <div className="text-xs text-gray-500">
                      {new Date(serviceRequest.resolvedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
