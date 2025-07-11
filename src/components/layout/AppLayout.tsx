
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
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
        <header className="bg-white border-b border-border/50 px-4 sm:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold font-display text-dark">Areion</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Business Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-border/50">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-dark">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive p-2">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto custom-scrollbar">
          <div className="animate-fade-in max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
