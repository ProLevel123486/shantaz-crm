"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SalesOrder {
  id: string;
  salesOrderNumber: string;
  orderDate: string;
  deliveryDate: string | null;
  total: number;
  status: string;
  account: { id: string; name: string } | null;
  contact: { id: string; name: string } | null;
  quote: { id: string; quoteNumber: string } | null;
  createdAt: string;
}

export default function SalesOrdersPage() {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchSalesOrders();
  }, [statusFilter]);

  const fetchSalesOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      
      const response = await fetch(`/api/sales-orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSalesOrders(data);
      }
    } catch (error) {
      console.error("Error fetching sales orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = salesOrders.filter(order => 
    order.salesOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.account?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: salesOrders.length,
    pending: salesOrders.filter(o => o.status === "PENDING").length,
    confirmed: salesOrders.filter(o => o.status === "CONFIRMED").length,
    delivered: salesOrders.filter(o => o.status === "DELIVERED").length,
    totalValue: salesOrders.reduce((sum, o) => sum + o.total, 0)
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
    return <div className="p-8">Loading sales orders...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600 mt-1">Manage your sales orders and fulfillment</p>
        </div>
        <Link
          href="/dashboard/sales-orders/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Sales Order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Confirmed</div>
          <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Delivered</div>
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Value</div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search orders..."
          className="flex-1 px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_PRODUCTION">In Production</option>
          <option value="READY_TO_SHIP">Ready to Ship</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No sales orders found. Create your first order to get started.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/sales-orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {order.salesOrderNumber}
                    </Link>
                    {order.quote && (
                      <div className="text-xs text-gray-500">From: {order.quote.quoteNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.account?.name || "-"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.contact?.name || "-"}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">${order.total.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/dashboard/sales-orders/${order.id}`} className="text-blue-600 hover:text-blue-800">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
