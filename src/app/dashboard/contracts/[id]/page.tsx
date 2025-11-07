"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Contract {
  id: string;
  contractNumber: string;
  name: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
  terms: string;
  account: { id: string; name: string } | null;
  deal: { id: string; name: string; stage: string } | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export default function ContractDetailPage() {
  const params = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchContract();
    }
  }, [params.id]);

  const fetchContract = async () => {
    try {
      const response = await fetch(`/api/contracts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setContract(data);
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/contracts/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchContract();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
      ACTIVE: "bg-green-100 text-green-800",
      EXPIRED: "bg-red-100 text-red-800",
      TERMINATED: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="p-8">Loading contract...</div>;
  }

  if (!contract) {
    return <div className="p-8">Contract not found</div>;
  }

  const daysUntilExpiry = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const duration = Math.ceil((new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{contract.contractNumber}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(contract.status)}`}>
              {contract.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-gray-600 mt-1">{contract.name}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Edit
          </button>
          {contract.status === "DRAFT" && (
            <button
              onClick={() => updateStatus("PENDING_APPROVAL")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit for Approval
            </button>
          )}
          {contract.status === "PENDING_APPROVAL" && (
            <button
              onClick={() => updateStatus("ACTIVE")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Approve & Activate
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Print
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Contract Value</div>
          <div className="text-2xl font-bold text-gray-900">${contract.value.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Duration</div>
          <div className="text-2xl font-bold text-blue-600">{duration} days</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Days Until Expiry</div>
          <div className={`text-2xl font-bold ${daysUntilExpiry < 30 ? "text-red-600" : "text-green-600"}`}>
            {daysUntilExpiry > 0 ? daysUntilExpiry : "Expired"}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-lg font-bold text-gray-900">{contract.status.replace(/_/g, " ")}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Contract Info */}
        <div className="col-span-1 space-y-6">
          {/* Contract Details */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Contract Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Contract #:</span>
                <span className="ml-2 font-medium">{contract.contractNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2">{contract.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Value:</span>
                <span className="ml-2 font-medium">${contract.value.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2">{contract.status.replace(/_/g, " ")}</span>
              </div>
              <div>
                <span className="text-gray-600">Start Date:</span>
                <span className="ml-2">{new Date(contract.startDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">End Date:</span>
                <span className="ml-2">{new Date(contract.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Related Records */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Related Records</h2>
            <div className="space-y-3 text-sm">
              {contract.account && (
                <div>
                  <span className="text-gray-600">Account:</span>
                  <Link
                    href={`/dashboard/accounts/${contract.account.id}`}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {contract.account.name}
                  </Link>
                </div>
              )}
              {contract.deal && (
                <div>
                  <span className="text-gray-600">Deal:</span>
                  <Link
                    href={`/dashboard/deals/${contract.deal.id}`}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {contract.deal.name}
                  </Link>
                  <div className="ml-2 text-gray-500 text-xs">{contract.deal.stage}</div>
                </div>
              )}
              <div>
                <span className="text-gray-600">Created By:</span>
                <span className="ml-2">{contract.createdBy?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2">{new Date(contract.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 text-left">
                Send for Signature
              </button>
              <button className="w-full px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 text-left">
                Download PDF
              </button>
              <button className="w-full px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 text-left">
                Schedule Renewal Reminder
              </button>
              <button className="w-full px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 text-left">
                Create Amendment
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Terms & Timeline */}
        <div className="col-span-2 space-y-6">
          {/* Contract Terms */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
            {contract.terms ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{contract.terms}</p>
              </div>
            ) : (
              <p className="text-gray-500">No terms specified</p>
            )}
          </div>

          {/* Contract Timeline */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Contract Timeline</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-6">
                {/* Created */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center relative z-10">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Contract Created</div>
                    <div className="text-xs text-gray-500">
                      {new Date(contract.createdAt).toLocaleDateString()} by {contract.createdBy?.name}
                    </div>
                  </div>
                </div>

                {/* Start Date */}
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                    new Date(contract.startDate) <= new Date() ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    <span className={`text-xs ${
                      new Date(contract.startDate) <= new Date() ? "text-green-600" : "text-gray-600"
                    }`}>
                      ▶
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Contract Start</div>
                    <div className="text-xs text-gray-500">
                      {new Date(contract.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* End Date */}
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                    new Date(contract.endDate) <= new Date() ? "bg-red-100" : "bg-gray-100"
                  }`}>
                    <span className={`text-xs ${
                      new Date(contract.endDate) <= new Date() ? "text-red-600" : "text-gray-600"
                    }`}>
                      ■
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Contract End</div>
                    <div className="text-xs text-gray-500">
                      {new Date(contract.endDate).toLocaleDateString()}
                      {daysUntilExpiry > 0 && daysUntilExpiry < 30 && (
                        <span className="ml-2 text-red-600 font-medium">
                          (Expiring soon!)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Renewal Alert */}
          {daysUntilExpiry > 0 && daysUntilExpiry < 60 && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600 text-xl">⚠️</span>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-900">Renewal Required</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    This contract expires in {daysUntilExpiry} days. Consider initiating renewal process.
                  </p>
                  <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700">
                    Start Renewal Process
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
