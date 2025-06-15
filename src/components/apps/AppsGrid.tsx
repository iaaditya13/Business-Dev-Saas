
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  Users, 
  Package, 
  Store, 
  TrendingUp, 
  Settings, 
  Calendar, 
  MessageSquare, 
  Shield, 
  BarChart3 
} from 'lucide-react';

const apps = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Business overview and analytics',
    icon: LayoutDashboard,
    category: 'Overview',
    color: 'bg-blue-500',
    route: '/dashboard'
  },
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

export const AppsGrid = () => {
  const [currentApp, setCurrentApp] = useState<string | null>(null);

  const handleAppClick = (appId: string, route: string) => {
    if (appId === 'dashboard') {
      setCurrentApp('dashboard');
    } else {
      window.location.href = route;
    }
  };

  const handleBackToApps = () => {
    setCurrentApp(null);
  };

  if (currentApp === 'dashboard') {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackToApps}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Apps</span>
            </Button>
          </div>
          <Dashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Areion</h1>
          <p className="text-muted-foreground">Choose an app to get started with your business management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map(app => (
            <Card 
              key={app.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => handleAppClick(app.id, app.route)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`${app.color} p-4 rounded-2xl`}>
                    <app.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">{app.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{app.description}</p>
                    <Badge variant="outline" className="text-xs">
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
