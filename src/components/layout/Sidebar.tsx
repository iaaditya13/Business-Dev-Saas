
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calculator,
  FileText,
  Receipt,
  Banknote,
  Table,
  FolderOpen,
  Users,
  ShoppingCart,
  Store,
  UtensilsCrossed,
  Package,
  Factory,
  FileCode,
  ShoppingBag,
  Wrench,
  Shield
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Finance',
    icon: Calculator,
    children: [
      { name: 'Accounting', href: '/finance/accounting', icon: Calculator },
      { name: 'Invoicing', href: '/finance/invoicing', icon: FileText },
      { name: 'Expenses', href: '/finance/expenses', icon: Receipt },
      { name: 'Spreadsheet', href: '/finance/spreadsheet', icon: Table },
      { name: 'Documents', href: '/finance/documents', icon: FolderOpen },
    ]
  },
  {
    name: 'Sales',
    icon: Users,
    children: [
      { name: 'CRM', href: '/sales/crm', icon: Users },
      { name: 'Sales', href: '/sales/sales', icon: ShoppingCart },
      { name: 'POS Shop', href: '/sales/pos-shop', icon: Store },
      { name: 'POS Restaurant', href: '/sales/pos-restaurant', icon: UtensilsCrossed },
    ]
  },
  {
    name: 'Supply Chain',
    icon: Package,
    children: [
      { name: 'Inventory', href: '/supply/inventory', icon: Package },
      { name: 'Manufacturing', href: '/supply/manufacturing', icon: Factory },
      { name: 'PLM', href: '/supply/plm', icon: FileCode },
      { name: 'Purchase', href: '/supply/purchase', icon: ShoppingBag },
      { name: 'Maintenance', href: '/supply/maintenance', icon: Wrench },
      { name: 'Quality', href: '/supply/quality', icon: Shield },
    ]
  },
];

export const Sidebar = () => {
  return (
    <div className="flex flex-col h-full p-4">
      <nav className="space-y-2">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                <div className="ml-6 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        )
                      }
                    >
                      <child.icon className="h-4 w-4" />
                      <span>{child.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};
