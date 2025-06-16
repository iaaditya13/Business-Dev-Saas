
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calculator,
  FileText,
  Receipt,
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
  Shield,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

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

export const ModernSidebar = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Finance', 'Sales', 'Supply Chain']));

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-border/50 w-72">
      <div className="p-8 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-dark">Areion</h1>
            <p className="text-sm text-muted-foreground">Business Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {navigation.map((item) => (
          <div key={item.name} className="space-y-1">
            {item.children ? (
              <>
                <button
                  onClick={() => toggleSection(item.name)}
                  className={cn(
                    'flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    'text-muted-foreground hover:text-dark hover:bg-muted/50',
                    'group'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight 
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      expandedSections.has(item.name) ? 'rotate-90' : ''
                    )} 
                  />
                </button>
                
                {expandedSections.has(item.name) && (
                  <div className="ml-6 space-y-1 animate-fade-in">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                            'relative group',
                            isActive
                              ? 'bg-primary/10 text-primary border-l-4 border-primary ml-2 pl-3'
                              : 'text-muted-foreground hover:text-dark hover:bg-muted/50'
                          )
                        }
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    'relative group',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-brand'
                      : 'text-muted-foreground hover:text-dark hover:bg-muted/50'
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

      <div className="p-6 border-t border-border/50">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-dark mb-2">Need Help?</h4>
          <p className="text-xs text-muted-foreground mb-3">Get support or check our documentation</p>
          <button className="text-xs text-primary hover:text-primary/80 font-medium">
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
};
