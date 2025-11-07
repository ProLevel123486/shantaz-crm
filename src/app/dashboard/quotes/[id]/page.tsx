"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  item: { id: string; name: string; itemCode: string } | null;
}

interface Quote {
  id: string;
  quoteNumber: string;
  validUntil: string;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  terms: string;
  notes: string;
  account: { id: string; name: string } | null;
  contact: { id: string; name: string; email: string; phone: string } | null;
  createdBy: { id: string; name: string; email: string } | null;
  items: QuoteItem[];
  createdAt: string;
  updatedAt: string;
}

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchQuote();
    }
  }, [params.id]);

  const fetchQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchQuote();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      SENT: "bg-blue-100 text-blue-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      EXPIRED: "bg-orange-100 text-orange-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="p-8">Loading quote...</div>;
  }

  if (!quote) {
    return <div className="p-8">Quote not found</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{quote.quoteNumber}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(quote.status)}`}>
              {quote.status}
            </span>
          </div>
          <p className="text-gray-600 mt-1">Created {new Date(quote.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          {quote.status === "DRAFT" && (
            <button
              onClick={() => updateStatus("SENT")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send Quote
            </button>
          )}
          {quote.status === "SENT" && (
            <>
              <button
                onClick={() => updateStatus("ACCEPTED")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark Accepted
              </button>
              <button
                onClick={() => updateStatus("REJECTED")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Mark Rejected
              </button>
            </>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Print
          </button>
        </div>
      </div>

      {/* Customer & Quote Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Account:</span>
              <Link href={`/dashboard/accounts/${quote.account?.id}`} className="ml-2 text-blue-600 hover:text-blue-800 font-medium">
                {quote.account?.name}
              </Link>
            </div>
            <div>
              <span className="text-gray-600">Contact:</span>
              <Link href={`/dashboard/contacts/${quote.contact?.id}`} className="ml-2 text-blue-600 hover:text-blue-800 font-medium">
                {quote.contact?.name}
              </Link>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2">{quote.contact?.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2">{quote.contact?.phone || "-"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Quote Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Quote Number:</span>
              <span className="ml-2 font-medium">{quote.quoteNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Valid Until:</span>
              <span className="ml-2">{new Date(quote.validUntil).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Created By:</span>
              <span className="ml-2">{quote.createdBy?.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <span className="ml-2">{new Date(quote.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Line Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quote.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm">
                    {item.item ? (
                      <div>
                        <div className="font-medium text-gray-900">{item.item.itemCode}</div>
                        <div className="text-gray-500">{item.item.name}</div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">${item.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-right text-red-600">-${item.discount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                    ${((item.quantity * item.unitPrice) - item.discount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${quote.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Discount:</span>
                <span className="font-medium text-red-600">-${quote.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total:</span>
                <span>${quote.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Notes */}
      {(quote.terms || quote.notes) && (
        <div className="grid grid-cols-2 gap-6">
          {quote.terms && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-3">Terms & Conditions</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.terms}</p>
            </div>
          )}
          {quote.notes && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-3">Internal Notes</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
