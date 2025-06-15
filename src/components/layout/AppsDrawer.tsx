
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Calculator, FileText, Users, Package, Store, TrendingUp, Settings, Calendar, MessageSquare, Shield, BarChart3 } from 'lucide-react';

interface AppsDrawerProps {
  onClose: () => void;
}

const apps = [
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Manage your finances and bookkeeping',
    icon: Calculator,
    category: 'Finance',
    color: 'bg-blue-500',
    route: '/finance/accounting'
  },
  {
    id: 'invoicing',
    name: 'Invoicing',
    description: 'Create and send professional invoices',
    icon: FileText,
    category: 'Finance',
    color: 'bg-green-500',
    route: '/finance/invoicing'
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Customer relationship management',
    icon: Users,
    category: 'Sales',
    color: 'bg-purple-500',
    route: '/sales/crm'
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Track your stock and products',
    icon: Package,
    category: 'Supply Chain',
    color: 'bg-orange-500',
    route: '/supply/inventory'
  },
  {
    id: 'pos-shop',
    name: 'POS Shop',
    description: 'Point of sale for retail',
    icon: Store,
    category: 'Sales',
    color: 'bg-red-500',
    route: '/sales/pos-shop'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Business insights and reports',
    icon: TrendingUp,
    category: 'Analytics',
    color: 'bg-indigo-500',
    route: '/analytics'
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configure your workspace',
    icon: Settings,
    category: 'System',
    color: 'bg-gray-500',
    route: '/settings'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Schedule and appointments',
    icon: Calendar,
    category: 'Productivity',
    color: 'bg-teal-500',
    route: '/calendar'
  },
  {
    id: 'messaging',
    name: 'Messaging',
    description: 'Internal team communication',
    icon: MessageSquare,
    category: 'Communication',
    color: 'bg-pink-500',
    route: '/messaging'
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Access control and permissions',
    icon: Shield,
    category: 'System',
    color: 'bg-yellow-500',
    route: '/security'
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Generate business reports',
    icon: BarChart3,
    category: 'Analytics',
    color: 'bg-cyan-500',
    route: '/reports'
  }
];

const categories = Array.from(new Set(apps.map(app => app.category)));

export const AppsDrawer = ({ onClose }: AppsDrawerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredApps = selectedCategory === 'All' 
    ? apps 
    : apps.filter(app => app.category === selectedCategory);

  const handleAppClick = (route: string) => {
    window.location.href = route;
    onClose();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Apps</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedCategory === 'All' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('All')}
          >
            All
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {filteredApps.map(app => (
            <Card 
              key={app.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleAppClick(app.route)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`${app.color} p-2 rounded-lg flex-shrink-0`}>
                    <app.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{app.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {app.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
