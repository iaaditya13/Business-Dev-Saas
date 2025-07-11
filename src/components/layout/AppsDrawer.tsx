
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AiAssistant } from '@/components/ai/AiAssistant';
import { X, Calculator, FileText, Users, Package, Store, TrendingUp, Settings, Calendar, MessageSquare, Shield, BarChart3, Bot } from 'lucide-react';

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
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    route: '/finance/accounting'
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    description: 'Get AI-powered business insights',
    icon: Bot,
    category: 'Productivity',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    isSpecial: true
  },
  {
    id: 'invoicing',
    name: 'Invoicing',
    description: 'Create and send professional invoices',
    icon: FileText,
    category: 'Finance',
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    route: '/finance/invoicing'
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Customer relationship management',
    icon: Users,
    category: 'Sales',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    route: '/sales/crm'
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Track your stock and products',
    icon: Package,
    category: 'Supply Chain',
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    route: '/supply/inventory'
  },
  {
    id: 'pos-shop',
    name: 'POS Shop',
    description: 'Point of sale for retail',
    icon: Store,
    category: 'Sales',
    color: 'bg-gradient-to-br from-red-500 to-red-600',
    route: '/sales/pos-shop'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Business insights and reports',
    icon: TrendingUp,
    category: 'Analytics',
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    route: '/analytics'
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configure your workspace',
    icon: Settings,
    category: 'System',
    color: 'bg-gradient-to-br from-gray-500 to-gray-600',
    route: '/settings'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Schedule and appointments',
    icon: Calendar,
    category: 'Productivity',
    color: 'bg-gradient-to-br from-teal-500 to-teal-600',
    route: '/calendar'
  },
  {
    id: 'messaging',
    name: 'Messaging',
    description: 'Internal team communication',
    icon: MessageSquare,
    category: 'Communication',
    color: 'bg-gradient-to-br from-pink-500 to-pink-600',
    route: '/messaging'
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Access control and permissions',
    icon: Shield,
    category: 'System',
    color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    route: '/security'
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Generate business reports',
    icon: BarChart3,
    category: 'Analytics',
    color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    route: '/reports'
  }
];

const categories = Array.from(new Set(apps.map(app => app.category)));

export const AppsDrawer = ({ onClose }: AppsDrawerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  const filteredApps = selectedCategory === 'All' 
    ? apps 
    : apps.filter(app => app.category === selectedCategory);

  const handleAppClick = (app: any) => {
    if (app.isSpecial && app.id === 'ai-assistant') {
      setShowAiAssistant(true);
    } else {
      window.location.href = app.route;
      onClose();
    }
  };

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex items-center justify-between p-6 border-b border-border bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Apps</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 border-b border-border bg-white">
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === 'All' ? 'default' : 'secondary'}
              className="cursor-pointer px-4 py-2 text-sm"
              onClick={() => setSelectedCategory('All')}
            >
              All
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredApps.map(app => (
              <Card 
                key={app.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 shadow-sm bg-white"
                onClick={() => handleAppClick(app)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <div className={`${app.color} p-4 rounded-2xl shadow-lg`}>
                    <app.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-gray-900 leading-tight">{app.name}</h3>
                    <p className="text-xs text-gray-500 hidden sm:block">{app.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={showAiAssistant} onOpenChange={setShowAiAssistant}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <AiAssistant onClose={() => setShowAiAssistant(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
