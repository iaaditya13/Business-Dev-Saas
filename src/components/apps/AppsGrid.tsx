
import { useState } from 'react';
import { apps } from './appsConfig';
import { AppCard } from './AppCard';
import { AppViewRenderer } from './AppViewRenderer';

export const AppsGrid = () => {
  const [currentApp, setCurrentApp] = useState<string | null>(null);

  const handleAppClick = (appId: string, route: string) => {
    console.log('App clicked:', appId, 'Route:', route);
    if (['dashboard', 'accounting', 'invoicing', 'crm', 'inventory', 'pos-shop', 'analytics', 'settings', 'calendar', 'messaging', 'security'].includes(appId)) {
      setCurrentApp(appId);
    } else {
      // For other apps that aren't implemented yet
      console.log('Navigating to:', route);
      window.location.href = route;
    }
  };

  const handleBackToApps = () => {
    setCurrentApp(null);
  };

  if (currentApp) {
    return (
      <AppViewRenderer 
        currentApp={currentApp} 
        onBackToApps={handleBackToApps} 
      />
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
            <AppCard 
              key={app.id} 
              app={app} 
              onClick={handleAppClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
