
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { JournalEntries } from './JournalEntries';
import { FinancialOverview } from './FinancialOverview';
import { useBusinessStore } from '@/stores/businessStore';

export const Accounting = () => {
  const { expenses, journalEntries } = useBusinessStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Accounting</h1>
        <p className="text-muted-foreground">Manage your finances and bookkeeping</p>
      </div>

      <FinancialOverview />

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpenseForm />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <ExpenseList expenses={expenses} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <JournalEntries entries={journalEntries} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed financial reports coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
