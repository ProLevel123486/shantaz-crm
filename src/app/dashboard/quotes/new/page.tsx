"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Account {
  id: string;
  name: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
}

interface Item {
  id: string;
  name: string;
  itemCode: string;
  sellingPrice: number;
}

interface QuoteItem {
  itemId: string;
  itemName?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export default function NewQuotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  const [formData, setFormData] = useState({
    accountId: "",
    contactId: "",
    validUntil: "",
    terms: "",
    notes: "",
    status: "DRAFT"
  });

  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    { itemId: "", description: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 }
  ]);

  useEffect(() => {
    fetchAccounts();
    fetchItems();
  }, []);

  useEffect(() => {
    if (formData.accountId) {
      fetchContacts(formData.accountId);
    }
  }, [formData.accountId]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchContacts = async (accountId: string) => {
    try {
      const response = await fetch(`/api/contacts?accountId=${accountId}`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/inventory/items");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...quoteItems];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto-fill price when item is selected
    if (field === "itemId" && value) {
      const item = items.find(i => i.id === value);
      if (item) {
        newItems[index].unitPrice = item.sellingPrice;
        newItems[index].itemName = item.name;
        newItems[index].description = item.name;
      }
    }

    // Calculate total
    const quantity = newItems[index].quantity || 0;
    const unitPrice = newItems[index].unitPrice || 0;
    const discount = newItems[index].discount || 0;
    newItems[index].total = (quantity * unitPrice) - discount;

    setQuoteItems(newItems);
  };

  const addItem = () => {
    setQuoteItems([...quoteItems, { itemId: "", description: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (quoteItems.length > 1) {
      setQuoteItems(quoteItems.filter((_, i) => i !== index));
    }
  };

  const subtotal = quoteItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalDiscount = quoteItems.reduce((sum, item) => sum + item.discount, 0);
  const total = subtotal - totalDiscount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: quoteItems.map(item => ({
            itemId: item.itemId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount
          })),
          subtotal,
          discount: totalDiscount,
          total
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/quotes/${data.id}`);
      } else {
        alert("Failed to create quote");
      }
    } catch (error) {
      console.error("Error creating quote:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">New Quote</h1>
        <p className="text-gray-600 mt-1">Create a new sales quote</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account *</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value, contactId: "" })}
                required
              >
                <option value="">Select Account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact *</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                required
                disabled={!formData.accountId}
              >
                <option value="">Select Contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>{contact.name} - {contact.email}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quote Items */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Line Items</h2>
            <button type="button" onClick={addItem} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              + Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {quoteItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-start p-4 border rounded-lg">
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Item</label>
                  <select
                    className="w-full px-3 py-2 border rounded text-sm"
                    value={item.itemId}
                    onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
                  >
                    <option value="">Select Item</option>
                    {items.map(i => (
                      <option key={i.id} value={i.id}>{i.itemCode} - {i.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded text-sm"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border rounded text-sm"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded text-sm"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Discount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded text-sm"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, "discount", parseFloat(e.target.value))}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total</label>
                  <div className="px-3 py-2 bg-gray-50 rounded text-sm font-medium">
                    ${item.total.toFixed(2)}
                  </div>
                </div>
                {quoteItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 mt-6"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Discount:</span>
                <span className="font-medium text-red-600">-${totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until *</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                placeholder="Payment terms, delivery conditions, etc."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Internal notes..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Quote"}
          </button>
        </div>
      </form>
    </div>
  );
}
