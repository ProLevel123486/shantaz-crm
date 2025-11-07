"use client"

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  DollarSign,
  Wrench,
  HardHat,
  FileText,
  Package,
  Receipt,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'CRM',
    icon: Users,
    children: [
      { name: 'Leads', href: '/dashboard/leads', icon: UserPlus },
      { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
      { name: 'Accounts', href: '/dashboard/accounts', icon: Building2 },
      { name: 'Deals', href: '/dashboard/deals', icon: DollarSign },
    ],
  },
  {
    name: 'Service',
    icon: Wrench,
    children: [
      { name: 'Service Requests', href: '/dashboard/service-requests', icon: Wrench },
      { name: 'Installations', href: '/dashboard/installations', icon: HardHat },
    ],
  },
  {
    name: 'Sales',
    icon: Receipt,
    children: [
      { name: 'Quotes', href: '/dashboard/quotes', icon: FileText },
      { name: 'Sales Orders', href: '/dashboard/sales-orders', icon: Receipt },
      { name: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
    ],
  },
  {
    name: 'Inventory',
    icon: Package,
    children: [
      { name: 'Items', href: '/dashboard/items', icon: Package },
      { name: 'Serial Numbers', href: '/dashboard/serial-numbers', icon: Package },
    ],
  },
  { name: 'Contracts', href: '/dashboard/contracts', icon: FileText },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Activities', href: '/dashboard/activities', icon: MessageSquare },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <span className="ml-3 text-lg font-semibold text-gray-900">Shantaz</span>
        </div>

        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) =>
              !item.children ? (
                <Link
                  key={item.name}
                  href={item.href || '#'}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ) : (
                <div key={item.name}>
                  <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.name}
                  </div>
                  <div className="space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`group flex items-center pl-8 pr-2 py-2 text-sm font-medium rounded-md ${
                          pathname === child.href
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <child.icon
                          className={`mr-3 h-4 w-4 flex-shrink-0 ${
                            pathname === child.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <div className="inline-block h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  {session?.user?.organizationName || 'Organization'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
