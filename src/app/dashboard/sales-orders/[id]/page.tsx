"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  item: { id: string; name: string; itemCode: string } | null;
}

interface SalesOrder {
  id: string;
  salesOrderNumber: string;
  orderDate: string;
  deliveryDate: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  notes: string;
  account: { id: string; name: string } | null;
  contact: { id: string; name: string; email: string; phone: string } | null;
  quote: { id: string; quoteNumber: string } | null;
  createdBy: { id: string; name: string } | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export default function SalesOrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/sales-orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/sales-orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrder();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      IN_PRODUCTION: "bg-purple-100 text-purple-800",
      READY_TO_SHIP: "bg-indigo-100 text-indigo-800",
      SHIPPED: "bg-cyan-100 text-cyan-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="p-8">Loading order...</div>;
  }

  if (!order) {
    return <div className="p-8">Order not found</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{order.salesOrderNumber}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Order Date: {new Date(order.orderDate).toLocaleDateString()}
            {order.quote && (
              <span className="ml-4">
                From Quote: <Link href={`/dashboard/quotes/${order.quote.id}`} className="text-blue-600 hover:text-blue-800">{order.quote.quoteNumber}</Link>
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {order.status === "PENDING" && (
            <button
              onClick={() => updateStatus("CONFIRMED")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm Order
            </button>
          )}
          {order.status === "CONFIRMED" && (
            <button
              onClick={() => updateStatus("IN_PRODUCTION")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Start Production
            </button>
          )}
          {order.status === "IN_PRODUCTION" && (
            <button
              onClick={() => updateStatus("READY_TO_SHIP")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Ready to Ship
            </button>
          )}
          {order.status === "READY_TO_SHIP" && (
            <button
              onClick={() => updateStatus("SHIPPED")}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              Mark Shipped
            </button>
          )}
          {order.status === "SHIPPED" && (
            <button
              onClick={() => updateStatus("DELIVERED")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Mark Delivered
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

      {/* Customer & Order Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Account:</span>
              <Link href={`/dashboard/accounts/${order.account?.id}`} className="ml-2 text-blue-600 hover:text-blue-800 font-medium">
                {order.account?.name}
              </Link>
            </div>
            <div>
              <span className="text-gray-600">Contact:</span>
              <Link href={`/dashboard/contacts/${order.contact?.id}`} className="ml-2 text-blue-600 hover:text-blue-800 font-medium">
                {order.contact?.name}
              </Link>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2">{order.contact?.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2">{order.contact?.phone || "-"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Order Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Order Number:</span>
              <span className="ml-2 font-medium">{order.salesOrderNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Order Date:</span>
              <span className="ml-2">{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Expected Delivery:</span>
              <span className="ml-2">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "Not set"}</span>
            </div>
            <div>
              <span className="text-gray-600">Created By:</span>
              <span className="ml-2">{order.createdBy?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Order Items</h2>
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
              {order.items.map((item) => (
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
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">-${order.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Notes</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
