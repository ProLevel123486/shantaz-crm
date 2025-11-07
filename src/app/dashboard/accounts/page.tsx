"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Eye, Edit, Building } from "lucide-react"
import Link from "next/link"

interface Account {
  id: string
  name: string
  industry: string
  website: string
  phone: string
  type: string
  _count: { contacts: number; deals: number }
  createdAt: string
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts")
      const data = await response.json()
      setAccounts(data)
    } catch (error) {
      console.error("Error fetching accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your business accounts</p>
        </div>
        <Link
          href="/dashboard/accounts/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          New Account
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center">Loading...</div>
        ) : filteredAccounts.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">No accounts found</div>
        ) : (
          filteredAccounts.map((account) => (
            <div key={account.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{account.name}</h3>
                    <p className="text-sm text-gray-500">{account.industry}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">Type: {account.type}</p>
                {account.website && (
                  <a
                    href={account.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    {account.website}
                  </a>
                )}
              </div>

              <div className="flex gap-4 mb-4 pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{account._count.contacts}</p>
                  <p className="text-xs text-gray-500">Contacts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{account._count.deals}</p>
                  <p className="text-xs text-gray-500">Deals</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/accounts/${account.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
                <Link
                  href={`/accounts/${account.id}/edit`}
                  className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
