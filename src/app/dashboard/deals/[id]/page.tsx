"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
  subject: string;
  description: string;
  createdAt: string;
  user: { name: string } | null;
}

interface Deal {
  id: string;
  name: string;
  stage: string;
  value: number;
  probability: number;
  closeDate: string;
  account: { id: string; name: string } | null;
  contact: { id: string; name: string; email: string } | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export default function DealDetailPage() {
  const params = useParams();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchDeal();
      fetchActivities();
    }
  }, [params.id]);

  const fetchDeal = async () => {
    try {
      const response = await fetch(`/api/deals/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setDeal(data);
      }
    } catch (error) {
      console.error("Error fetching deal:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activities?dealId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const updateStage = async (newStage: string) => {
    try {
      const response = await fetch(`/api/deals/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage })
      });

      if (response.ok) {
        fetchDeal();
      }
    } catch (error) {
      console.error("Error updating stage:", error);
    }
  };

  const stages = ["QUALIFICATION", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];

  if (loading) {
    return <div className="p-8">Loading deal...</div>;
  }

  if (!deal) {
    return <div className="p-8">Deal not found</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{deal.name}</h1>
          <p className="text-gray-600 mt-1">
            Created {new Date(deal.createdAt).toLocaleDateString()} by {deal.createdBy?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Edit
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Log Activity
          </button>
        </div>
      </div>

      {/* Deal Value & Progress */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-sm text-gray-600">Deal Value</div>
          <div className="text-3xl font-bold text-gray-900">${deal.value.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-sm text-gray-600">Probability</div>
          <div className="text-3xl font-bold text-blue-600">{deal.probability}%</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${deal.probability}%` }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-sm text-gray-600">Expected Close</div>
          <div className="text-3xl font-bold text-gray-900">
            {new Date(deal.closeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Stage Pipeline */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <h2 className="text-lg font-semibold mb-4">Deal Stage</h2>
        <div className="flex items-center justify-between gap-2">
          {stages.map((stage, index) => {
            const isActive = stage === deal.stage;
            const isPassed = stages.indexOf(deal.stage) > index;
            return (
              <div key={stage} className="flex-1">
                <button
                  onClick={() => updateStage(stage)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isPassed
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {stage.replace(/_/g, " ")}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Deal Information */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Deal Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Stage:</span>
                <span className="ml-2 font-medium">{deal.stage.replace(/_/g, " ")}</span>
              </div>
              <div>
                <span className="text-gray-600">Value:</span>
                <span className="ml-2 font-medium">${deal.value.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Probability:</span>
                <span className="ml-2 font-medium">{deal.probability}%</span>
              </div>
              <div>
                <span className="text-gray-600">Close Date:</span>
                <span className="ml-2">{new Date(deal.closeDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Related Records</h2>
            <div className="space-y-3 text-sm">
              {deal.account && (
                <div>
                  <span className="text-gray-600">Account:</span>
                  <Link
                    href={`/dashboard/accounts/${deal.account.id}`}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {deal.account.name}
                  </Link>
                </div>
              )}
              {deal.contact && (
                <div>
                  <span className="text-gray-600">Contact:</span>
                  <Link
                    href={`/dashboard/contacts/${deal.contact.id}`}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {deal.contact.name}
                  </Link>
                  <div className="ml-2 text-gray-500 text-xs">{deal.contact.email}</div>
                </div>
              )}
              <div>
                <span className="text-gray-600">Created By:</span>
                <span className="ml-2">{deal.createdBy?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Activity Timeline</h2>
            </div>
            <div className="p-6">
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-semibold">
                          {activity.type[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{activity.subject}</h3>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded">{activity.type}</span>
                          {activity.user && <span>by {activity.user.name}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No activities yet. Start by logging a call, meeting, or note.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
