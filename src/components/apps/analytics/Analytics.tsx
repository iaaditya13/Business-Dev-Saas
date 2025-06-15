
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueAnalytics } from './RevenueAnalytics';
import { SalesAnalytics } from './SalesAnalytics';
import { CustomerAnalytics } from './CustomerAnalytics';
import { TrendingUp, DollarSign, Users, Package } from 'lucide-react';

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your business performance</p>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Sales</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Customers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueAnalytics />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <SalesAnalytics />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <CustomerAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
