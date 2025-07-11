
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
    icon: Calculator,
    category: 'Finance',
    route: '/finance/accounting'
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    icon: Bot,
    category: 'Productivity',
    isSpecial: true
  },
  {
    id: 'invoicing',
    name: 'Invoicing',
    icon: FileText,
    category: 'Finance',
    route: '/finance/invoicing'
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: Users,
    category: 'Sales',
    route: '/sales/crm'
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: Package,
    category: 'Supply Chain',
    route: '/supply/inventory'
  },
  {
    id: 'pos-shop',
    name: 'POS Shop',
    icon: Store,
    category: 'Sales',
    route: '/sales/pos-shop'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: TrendingUp,
    category: 'Analytics',
    route: '/analytics'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    category: 'System',
    route: '/settings'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: Calendar,
    category: 'Productivity',
    route: '/calendar'
  },
  {
    id: 'messaging',
    name: 'Messaging',
    icon: MessageSquare,
    category: 'Communication',
    route: '/messaging'
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    category: 'System',
    route: '/security'
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: BarChart3,
    category: 'Analytics',
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
      <div className="h-full flex flex-col bg-background">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">Apps</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 border-b border-border">
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
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {filteredApps.map(app => (
              <div 
                key={app.id} 
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200 flex flex-col items-center space-y-3"
                onClick={() => handleAppClick(app)}
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <app.icon className="h-8 w-8 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground text-center leading-tight">
                  {app.name}
                </span>
              </div>
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
