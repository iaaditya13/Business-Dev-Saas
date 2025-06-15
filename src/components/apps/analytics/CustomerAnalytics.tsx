
import { useBusinessStore } from '@/stores/businessStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, UserPlus, DollarSign, TrendingUp } from 'lucide-react';

const chartConfig = {
  customers: {
    label: 'Customers',
    color: 'hsl(var(--chart-1))',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-2))',
  },
  leads: {
    label: 'Leads',
    color: 'hsl(var(--chart-3))',
  },
};

export const CustomerAnalytics = () => {
  const { invoices, leads, orders } = useBusinessStore();

  // Calculate customer value
  const customerValue = () => {
    const customers = {};
    
    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        if (!customers[invoice.customerId]) {
          customers[invoice.customerId] = {
            name: invoice.customerName,
            revenue: 0,
            invoices: 0
          };
        }
        customers[invoice.customerId].revenue += invoice.amount;
        customers[invoice.customerId].invoices += 1;
      }
    });

    return Object.values(customers)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Calculate lead conversion by status
  const leadStatusData = () => {
    const statuses = {};
    leads.forEach(lead => {
      if (!statuses[lead.status]) {
        statuses[lead.status] = { name: lead.status, value: 0 };
      }
      statuses[lead.status].value += 1;
    });
    return Object.values(statuses);
  };

  // Calculate monthly customer acquisition
  const monthlyCustomers = () => {
    const months = {};
    
    // Track new customers from invoices
    const seenCustomers = new Set();
    invoices
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .forEach(invoice => {
        if (!seenCustomers.has(invoice.customerId)) {
          seenCustomers.add(invoice.customerId);
          const month = new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          if (!months[month]) {
            months[month] = { month, customers: 0, leads: 0 };
          }
          months[month].customers += 1;
        }
      });

    // Track leads by month
    leads.forEach(lead => {
      const month = new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!months[month]) {
        months[month] = { month, customers: 0, leads: 0 };
      }
      months[month].leads += 1;
    });

    return Object.values(months).sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const totalCustomers = new Set(invoices.map(inv => inv.customerId)).size;
  const totalLeads = leads.length;
  const wonLeads = leads.filter(lead => lead.status === 'won').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;
  const averageCustomerValue = customerValue().length > 0 ? 
    customerValue().reduce((sum: number, customer: any) => sum + customer.revenue, 0) / customerValue().length : 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {wonLeads} converted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Leads to customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Customer Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageCustomerValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Acquisition Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Acquisition</CardTitle>
          <CardDescription>New customers and leads over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={monthlyCustomers()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="customers" stroke="var(--color-customers)" name="New Customers" strokeWidth={2} />
              <Line type="monotone" dataKey="leads" stroke="var(--color-leads)" name="New Leads" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers by Revenue</CardTitle>
            <CardDescription>Highest value customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={customerValue()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" name="Revenue" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Lead Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Pipeline</CardTitle>
            <CardDescription>Distribution of leads by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={leadStatusData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {leadStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Details */}
      {customerValue().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Value Breakdown</CardTitle>
            <CardDescription>Detailed customer revenue information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerValue().map((customer: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.invoices} invoices
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${customer.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Avg: ${(customer.revenue / customer.invoices).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
