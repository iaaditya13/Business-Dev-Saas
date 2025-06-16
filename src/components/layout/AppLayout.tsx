
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { AiAssistant } from '@/components/ai/AiAssistant';
import { LogOut, Settings, Bell, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [userProfile, setUserProfile] = useState<{ full_name?: string; business_name?: string } | null>(null);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, business_name')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, [user]);

  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white border-b border-border/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display text-dark">Areion</h1>
                  <p className="text-sm text-muted-foreground">Business Platform</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 border-border/50 hover:border-primary/50"
                onClick={() => setShowAiAssistant(true)}
              >
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">AI Assistant</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 border-border/50 hover:border-primary/50"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 border-border/50 hover:border-primary/50"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-border/50">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-dark">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto custom-scrollbar">
          <div className="animate-fade-in max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={showAiAssistant} onOpenChange={setShowAiAssistant}>
        <DialogPortal>
          <DialogOverlay className="bg-black/20 backdrop-blur-sm" />
          <div
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-4 border-0 bg-white p-0 shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl h-[85vh]"
            )}
          >
            <AiAssistant onClose={() => setShowAiAssistant(false)} />
          </div>
        </DialogPortal>
      </Dialog>
    </div>
  );
};
