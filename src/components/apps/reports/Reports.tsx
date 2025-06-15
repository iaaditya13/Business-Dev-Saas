
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialReports } from './FinancialReports';
import { SalesReports } from './SalesReports';
import { InventoryReports } from './InventoryReports';
import { CustomerReports } from './CustomerReports';

export const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Business Reports</h1>
        <p className="text-muted-foreground">Generate comprehensive reports for your business performance</p>
      </div>

      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="sales">
          <SalesReports />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryReports />
        </TabsContent>

        <TabsContent value="customer">
          <CustomerReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
