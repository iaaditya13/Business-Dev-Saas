
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
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
            
            <h1 className="text-xl font-semibold text-gray-900">Business Manager</h1>
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
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
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
        <div className="hidden md:block w-64 bg-white border-r border-gray-200">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* AI Assistant */}
        {showAiAssistant && (
          <div className="w-96 border-l border-gray-200 bg-white">
            <AiAssistant onClose={() => setShowAiAssistant(false)} />
          </div>
        )}
      </div>
    </div>
  );
};
