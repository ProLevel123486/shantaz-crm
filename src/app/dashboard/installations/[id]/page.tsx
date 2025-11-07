"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Installation {
  id: string;
  workOrderNumber: string;
  scheduledDate: string;
  completedDate: string | null;
  status: string;
  engineerTeam: string[];
  notes: string;
  contact: { id: string; name: string; email: string; phone: string } | null;
  account: { id: string; name: string } | null;
  salesOrder: { id: string; salesOrderNumber: string } | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export default function InstallationDetailPage() {
  const params = useParams();
  const [installation, setInstallation] = useState<Installation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInstallation();
    }
  }, [params.id]);

  const fetchInstallation = async () => {
    try {
      const response = await fetch(`/api/installations/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setInstallation(data);
      }
    } catch (error) {
      console.error("Error fetching installation:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/installations/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchInstallation();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      ON_HOLD: "bg-orange-100 text-orange-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="p-8">Loading installation...</div>;
  }

  if (!installation) {
    return <div className="p-8">Installation not found</div>;
  }

  const progress = installation.status === "COMPLETED" ? 100 : installation.status === "IN_PROGRESS" ? 50 : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{installation.workOrderNumber}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(installation.status)}`}>
              {installation.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Scheduled for {new Date(installation.scheduledDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Edit
          </button>
          {installation.status === "SCHEDULED" && (
            <button
              onClick={() => updateStatus("IN_PROGRESS")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Installation
            </button>
          )}
          {installation.status === "IN_PROGRESS" && (
            <button
              onClick={() => updateStatus("COMPLETED")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Installation Progress</h2>
          <span className="text-2xl font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Scheduled</span>
          <span>In Progress</span>
          <span>Completed</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="col-span-1 space-y-6">
          {/* Installation Information */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Work Order Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Work Order #:</span>
                <span className="ml-2 font-medium">{installation.workOrderNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2">{installation.status.replace(/_/g, " ")}</span>
              </div>
              <div>
                <span className="text-gray-600">Scheduled:</span>
                <span className="ml-2">{new Date(installation.scheduledDate).toLocaleDateString()}</span>
              </div>
              {installation.completedDate && (
                <div>
                  <span className="text-gray-600">Completed:</span>
                  <span className="ml-2">{new Date(installation.completedDate).toLocaleDateString()}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2">{new Date(installation.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3 text-sm">
              {installation.account && (
                <div>
                  <span className="text-gray-600">Account:</span>
                  <Link
                    href={`/dashboard/accounts/${installation.account.id}`}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {installation.account.name}
                  </Link>
                </div>
              )}
              {installation.contact && (
                <>
                  <div>
                    <span className="text-gray-600">Contact:</span>
                    <Link
                      href={`/dashboard/contacts/${installation.contact.id}`}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {installation.contact.name}
                    </Link>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <a
                      href={`mailto:${installation.contact.email}`}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      {installation.contact.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <a
                      href={`tel:${installation.contact.phone}`}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      {installation.contact.phone}
                    </a>
                  </div>
                </>
              )}
              {installation.salesOrder && (
                <div>
                  <span className="text-gray-600">Sales Order:</span>
                  <Link
                    href={`/dashboard/sales-orders/${installation.salesOrder.id}`}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {installation.salesOrder.salesOrderNumber}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Engineer Team */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Engineer Team</h2>
            {installation.engineerTeam && installation.engineerTeam.length > 0 ? (
              <div className="space-y-2">
                {installation.engineerTeam.map((engineer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">
                        {engineer.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">{engineer}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No engineers assigned</p>
            )}
          </div>
        </div>

        {/* Right Column - Notes & Timeline */}
        <div className="col-span-2 space-y-6">
          {/* Installation Notes */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Installation Notes</h2>
            {installation.notes ? (
              <p className="text-gray-700 whitespace-pre-wrap">{installation.notes}</p>
            ) : (
              <p className="text-gray-500">No notes added yet</p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Installation Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Work order created</div>
                  <div className="text-xs text-gray-500">
                    {new Date(installation.createdAt).toLocaleString()} by {installation.createdBy?.name}
                  </div>
                </div>
              </div>

              {installation.status !== "SCHEDULED" && (
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-2 h-2 rounded-full bg-yellow-600 mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Installation started</div>
                    <div className="text-xs text-gray-500">
                      {new Date(installation.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {installation.completedDate && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Installation completed</div>
                    <div className="text-xs text-gray-500">
                      {new Date(installation.completedDate).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                Send Confirmation Email
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                Schedule Follow-up
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                Print Work Order
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                Add Photos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
