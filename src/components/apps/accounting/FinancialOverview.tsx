
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessStore } from '@/stores/businessStore';
import { TrendingUp, TrendingDown, DollarSign, Calculator } from 'lucide-react';

export const FinancialOverview = () => {
  const { expenses, invoices } = useBusinessStore();

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const pendingInvoices = invoices
    .filter(invoice => invoice.status !== 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">From paid invoices</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All recorded expenses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          <Calculator className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${netIncome.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Revenue - Expenses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          <DollarSign className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">${pendingInvoices.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Unpaid invoices</p>
        </CardContent>
      </Card>
    </div>
  );
};
