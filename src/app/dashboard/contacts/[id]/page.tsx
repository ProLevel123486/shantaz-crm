"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
  subject: string;
  description: string;
  createdAt: string;
  user: { name: string } | null;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  isPrimary: boolean;
  account: { id: string; name: string } | null;
  deals: Array<{ id: string; name: string; stage: string; value: number }>;
  serviceRequests: Array<{ id: string; ticketNumber: string; status: string }>;
  createdAt: string;
  updatedAt: string;
}

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchContact();
      fetchActivities();
    }
  }, [params.id]);

  const fetchContact = async () => {
    try {
      const response = await fetch(`/api/contacts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setContact(data);
      }
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activities?contactId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading contact...</div>;
  }

  if (!contact) {
    return <div className="p-8">Contact not found</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
          <p className="text-gray-600 mt-1">{contact.position} {contact.department && `• ${contact.department}`}</p>
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

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Contact Info */}
        <div className="col-span-1 space-y-6">
          {/* Contact Details */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Email:</span>
                <a href={`mailto:${contact.email}`} className="ml-2 text-blue-600 hover:text-blue-800">
                  {contact.email}
                </a>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <a href={`tel:${contact.phone}`} className="ml-2 text-blue-600 hover:text-blue-800">
                  {contact.phone}
                </a>
              </div>
              {contact.account && (
                <div>
                  <span className="text-gray-600">Account:</span>
                  <Link
                    href={`/dashboard/accounts/${contact.account.id}`}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {contact.account.name}
                  </Link>
                </div>
              )}
              <div>
                <span className="text-gray-600">Primary Contact:</span>
                <span className="ml-2">{contact.isPrimary ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          {/* Related Deals */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Deals ({contact.deals?.length || 0})</h2>
            <div className="space-y-2">
              {contact.deals && contact.deals.length > 0 ? (
                contact.deals.map(deal => (
                  <Link
                    key={deal.id}
                    href={`/dashboard/deals/${deal.id}`}
                    className="block p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">{deal.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {deal.stage} • ${deal.value.toLocaleString()}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500">No deals yet</p>
              )}
            </div>
          </div>

          {/* Service Requests */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Service Requests ({contact.serviceRequests?.length || 0})</h2>
            <div className="space-y-2">
              {contact.serviceRequests && contact.serviceRequests.length > 0 ? (
                contact.serviceRequests.map(sr => (
                  <Link
                    key={sr.id}
                    href={`/dashboard/service-requests/${sr.id}`}
                    className="block p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">{sr.ticketNumber}</div>
                    <div className="text-sm text-gray-600 mt-1">{sr.status}</div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500">No service requests</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Activity Timeline */}
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
