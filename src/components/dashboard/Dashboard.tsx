
import { useState } from 'react';
import { useBusinessStore } from '@/stores/businessStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicDashboard } from './BasicDashboard';
import { AdvancedDashboard } from './AdvancedDashboard';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChart3, Layout } from 'lucide-react';

export const Dashboard = () => {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600">Overview of your business performance</p>
        </div>
        
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => value && setMode(value as 'basic' | 'advanced')}
        >
          <ToggleGroupItem value="basic" className="flex items-center space-x-2">
            <Layout className="h-4 w-4" />
            <span>Basic</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="advanced" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Advanced</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {mode === 'basic' ? <BasicDashboard /> : <AdvancedDashboard />}
    </div>
  );
};
