"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Contact {
  id: string;
  name: string;
  email: string;
  position: string;
  isPrimary: boolean;
}

interface Deal {
  id: string;
  name: string;
  stage: string;
  value: number;
  probability: number;
}

interface Account {
  id: string;
  name: string;
  industry: string;
  type: string;
  website: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
  contacts: Contact[];
  deals: Deal[];
  createdAt: string;
  updatedAt: string;
}

export default function AccountDetailPage() {
  const params = useParams();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchAccount();
    }
  }, [params.id]);

  const fetchAccount = async () => {
    try {
      const response = await fetch(`/api/accounts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAccount(data);
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading account...</div>;
  }

  if (!account) {
    return <div className="p-8">Account not found</div>;
  }

  const totalDealsValue = account.deals?.reduce((sum, deal) => sum + deal.value, 0) || 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{account.name}</h1>
          <p className="text-gray-600 mt-1">{account.industry} • {account.type}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Edit
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + New Deal
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Contacts</div>
          <div className="text-2xl font-bold text-gray-900">{account.contacts?.length || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Active Deals</div>
          <div className="text-2xl font-bold text-blue-600">{account.deals?.length || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Deal Value</div>
          <div className="text-2xl font-bold text-green-600">${totalDealsValue.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Customer Since</div>
          <div className="text-2xl font-bold text-gray-900">
            {new Date(account.createdAt).getFullYear()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Account Information */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Website:</span>
                {account.website ? (
                  <a
                    href={account.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    {account.website}
                  </a>
                ) : (
                  <span className="ml-2 text-gray-400">-</span>
                )}
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                {account.phone ? (
                  <a href={`tel:${account.phone}`} className="ml-2 text-blue-600 hover:text-blue-800">
                    {account.phone}
                  </a>
                ) : (
                  <span className="ml-2 text-gray-400">-</span>
                )}
              </div>
              <div>
                <span className="text-gray-600">Industry:</span>
                <span className="ml-2">{account.industry}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2">{account.type}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Addresses</h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-gray-600 font-medium mb-1">Billing Address</div>
                <p className="text-gray-900">{account.billingAddress || "Not specified"}</p>
              </div>
              <div>
                <div className="text-gray-600 font-medium mb-1">Shipping Address</div>
                <p className="text-gray-900">{account.shippingAddress || "Same as billing"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contacts & Deals */}
        <div className="col-span-2 space-y-6">
          {/* Contacts */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Contacts ({account.contacts?.length || 0})</h2>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                + Add Contact
              </button>
            </div>
            <div className="divide-y">
              {account.contacts && account.contacts.length > 0 ? (
                account.contacts.map(contact => (
                  <Link
                    key={contact.id}
                    href={`/dashboard/contacts/${contact.id}`}
                    className="block p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {contact.name}
                          {contact.isPrimary && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{contact.position}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                      <span className="text-blue-600">→</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No contacts yet. Add a contact to get started.
                </div>
              )}
            </div>
          </div>

          {/* Deals */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Deals ({account.deals?.length || 0})</h2>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                + Add Deal
              </button>
            </div>
            <div className="divide-y">
              {account.deals && account.deals.length > 0 ? (
                account.deals.map(deal => (
                  <Link
                    key={deal.id}
                    href={`/dashboard/deals/${deal.id}`}
                    className="block p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{deal.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {deal.stage} • {deal.probability}% probability
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${deal.value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 mt-1">→</div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No deals yet. Create a deal to track opportunities.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
