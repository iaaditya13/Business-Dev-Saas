
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Accounting } from './accounting/Accounting';
import { Invoicing } from './invoicing/Invoicing';
import { CRM } from './crm/CRM';
import { Inventory } from './inventory/Inventory';
import { POSShop } from './pos/POSShop';
import { Analytics } from './analytics/Analytics';
import { Settings } from './settings/Settings';
import { Calendar } from './calendar/Calendar';
import { Messaging } from './messaging/Messaging';
import { Security } from './security/Security';
import { Reports } from './reports/Reports';
import { AiAssistantApp } from './ai-assistant/AiAssistantApp';

interface AppViewRendererProps {
  currentApp: string;
  onBackToApps: () => void;
}

export const AppViewRenderer = ({ currentApp, onBackToApps }: AppViewRendererProps) => {
  const renderAppContent = () => {
    try {
      switch (currentApp) {
        case 'dashboard':
          return <Dashboard />;
        case 'ai-assistant':
          return <AiAssistantApp />;
        case 'accounting':
          return <Accounting />;
        case 'invoicing':
          return <Invoicing />;
        case 'crm':
          return <CRM />;
        case 'inventory':
          return <Inventory />;
        case 'pos-shop':
          return <POSShop />;
        case 'analytics':
          return <Analytics />;
        case 'settings':
          return <Settings />;
        case 'calendar':
          return <Calendar />;
        case 'messaging':
          return <Messaging />;
        case 'security':
          return <Security />;
        case 'reports':
          return <Reports />;
        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering app:', error);
      return (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-red-600">App Loading Error</h3>
          <p className="text-muted-foreground mt-2">
            There was an error loading this app. Please try again.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={onBackToApps}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Apps</span>
          </Button>
        </div>
        {renderAppContent()}
      </div>
    </div>
  );
};
