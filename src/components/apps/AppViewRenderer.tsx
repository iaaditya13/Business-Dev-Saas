
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Accounting } from './accounting/Accounting';
import { Invoicing } from './invoicing/Invoicing';
import { CRM } from './crm/CRM';
import { Inventory } from './inventory/Inventory';

interface AppViewRendererProps {
  currentApp: string;
  onBackToApps: () => void;
}

export const AppViewRenderer = ({ currentApp, onBackToApps }: AppViewRendererProps) => {
  const renderAppContent = () => {
    switch (currentApp) {
      case 'dashboard':
        return <Dashboard />;
      case 'accounting':
        return <Accounting />;
      case 'invoicing':
        return <Invoicing />;
      case 'crm':
        return <CRM />;
      case 'inventory':
        return <Inventory />;
      default:
        return null;
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
