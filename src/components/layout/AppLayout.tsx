
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/components/layout/Sidebar';
import { AiAssistant } from '@/components/ai/AiAssistant';
import { Menu, LogOut, Bot } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <Sidebar />
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-semibold text-foreground">Business Manager</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAiAssistant(!showAiAssistant)}
              className="flex items-center space-x-2"
            >
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Welcome, {user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-card border-r border-border">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>

        {/* AI Assistant */}
        {showAiAssistant && (
          <div className="w-96 border-l border-border bg-card">
            <AiAssistant onClose={() => setShowAiAssistant(false)} />
          </div>
        )}
      </div>
    </div>
  );
};
