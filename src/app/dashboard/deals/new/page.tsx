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

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    stage: "QUALIFICATION",
    value: "",
    probability: "25",
    closeDate: "",
    accountId: "",
    contactId: ""
  });

  useEffect(() => {
    fetchAccounts();
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

  const handleStageChange = (stage: string) => {
    const probabilityMap: Record<string, string> = {
      QUALIFICATION: "25",
      PROPOSAL: "50",
      NEGOTIATION: "75",
      CLOSED_WON: "100",
      CLOSED_LOST: "0"
    };
    setFormData({ ...formData, stage, probability: probabilityMap[stage] || "50" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          probability: parseInt(formData.probability)
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/deals/${data.id}`);
      } else {
        alert("Failed to create deal");
      }
    } catch (error) {
      console.error("Error creating deal:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">New Deal</h1>
        <p className="text-gray-600 mt-1">Create a new sales opportunity</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Name *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Q4 Software License - Acme Corp"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account *
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value, contactId: "" })}
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              disabled={!formData.accountId}
            >
              <option value="">Select Contact</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} - {contact.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Value *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-2 border rounded-lg"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Close Date *
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.closeDate}
              onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stage *
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.stage}
              onChange={(e) => handleStageChange(e.target.value)}
              required
            >
              <option value="QUALIFICATION">Qualification</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="CLOSED_WON">Closed Won</option>
              <option value="CLOSED_LOST">Closed Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Probability (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
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
            {loading ? "Creating..." : "Create Deal"}
          </button>
        </div>
      </form>
    </div>
  );
}
