
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicDashboard } from './BasicDashboard';
import { AdvancedDashboard } from './AdvancedDashboard';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChart3, Layout, TrendingUp, Sparkles } from 'lucide-react';

export const Dashboard = () => {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-display text-dark">
            Business Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time insights into your business performance
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => value && setMode(value as 'basic' | 'advanced')}
            className="bg-white border border-border/50 p-1 rounded-xl shadow-soft"
          >
            <ToggleGroupItem 
              value="basic" 
              className="flex items-center space-x-2 px-6 py-2 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Layout className="h-4 w-4" />
              <span>Overview</span>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="advanced" 
              className="flex items-center space-x-2 px-6 py-2 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </ToggleGroupItem>
          </ToggleGroup>

          <Button className="flex items-center space-x-2" size="lg">
            <Sparkles className="h-4 w-4" />
            <span>Generate Report</span>
          </Button>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-primary">Revenue Growth</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark mb-2">+23.5%</div>
            <p className="text-sm text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-success/5 to-success/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-success">Active Projects</CardTitle>
              <BarChart3 className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark mb-2">127</div>
            <p className="text-sm text-muted-foreground">projects in progress</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-warning">Team Efficiency</CardTitle>
              <Sparkles className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark mb-2">94.2%</div>
            <p className="text-sm text-muted-foreground">productivity score</p>
          </CardContent>
        </Card>
      </div>

      {mode === 'basic' ? <BasicDashboard /> : <AdvancedDashboard />}
    </div>
  );
};
