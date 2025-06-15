
import { useBusinessStore } from '@/stores/businessStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses", 
    color: "hsl(var(--chart-2))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-3))",
  },
};

export const AdvancedDashboard = () => {
  const { invoices, expenses, leads, products, orders } = useBusinessStore();

  // Revenue vs Expenses by Month
  const monthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const monthRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0) / 6; // Mock monthly data
      
      const monthExpenses = expenses
        .filter(exp => exp.status === 'approved')
        .reduce((sum, exp) => sum + exp.amount, 0) / 6; // Mock monthly data

      return {
        month,
        revenue: Math.round(monthRevenue),
        expenses: Math.round(monthExpenses),
        profit: Math.round(monthRevenue - monthExpenses)
      };
    });
  };

  // Sales by Product Category
  const categoryData = () => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category);
      const totalSales = categoryProducts.reduce((sum, product) => {
        const sold = orders
          .flatMap(order => order.items)
          .filter(item => item.productId === product.id)
          .reduce((itemSum, item) => itemSum + (item.quantity * item.price), 0);
        return sum + sold;
      }, 0);

      return {
        category: category || 'Uncategorized',
        sales: totalSales,
        count: categoryProducts.length
      };
    });
  };

  // Lead Funnel Data
  const leadFunnelData = () => {
    const statuses = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    return statuses.map(status => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: leads.filter(lead => lead.status === status).length,
      value: leads
        .filter(lead => lead.status === status)
        .reduce((sum, lead) => sum + lead.value, 0)
    }));
  };

  // Customer LTV and Churn (mock data for now)
  const customerMetrics = {
    totalCustomers: new Set(invoices.map(inv => inv.customerId)).size,
    averageLTV: invoices.length > 0 ? 
      invoices.reduce((sum, inv) => sum + inv.amount, 0) / new Set(invoices.map(inv => inv.customerId)).size : 0,
    churnRate: 5.2, // Mock churn rate
    newCustomersThisMonth: Math.floor(new Set(invoices.map(inv => inv.customerId)).size * 0.1)
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Generate Report</span>
        </Button>
      </div>

      {/* Revenue vs Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
          <CardDescription>Monthly comparison of income and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={monthlyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" />
              <Bar dataKey="expenses" fill="var(--color-expenses)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Product category performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <PieChart>
                <Pie
                  data={categoryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, sales }) => `${category}: $${sales}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {categoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Lead Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Funnel</CardTitle>
            <CardDescription>Lead progression through sales stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leadFunnelData().map((stage, index) => (
                <div key={stage.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="font-medium">{stage.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{stage.count} leads</p>
                    <p className="text-sm text-muted-foreground">
                      ${stage.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +{customerMetrics.newCustomersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average LTV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customerMetrics.averageLTV.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.churnRate}%</div>
            <p className="text-xs text-muted-foreground">Monthly churn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.length > 0 ? 
                Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100) : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">Lead to customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>AI-generated business insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Opportunities</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Revenue growth of 15% compared to last month</li>
                <li>• Top performing category: {categoryData()[0]?.category}</li>
                <li>• {leads.filter(l => l.status === 'qualified').length} qualified leads ready for follow-up</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">Attention Needed</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {invoices.filter(inv => inv.status === 'overdue').length} overdue invoices</li>
                <li>• {leads.filter(l => l.status === 'lost').length} leads marked as lost this month</li>
                <li>• Expense ratio at {Math.round((customerMetrics.averageLTV * 0.3))}% of revenue</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
