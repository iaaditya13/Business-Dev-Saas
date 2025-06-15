
import { useBusinessStore } from '@/stores/businessStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Download, Users, Star, TrendingUp, Heart } from 'lucide-react';

export const CustomerReports = () => {
  const { leads, orders, invoices } = useBusinessStore();

  // Calculate customer metrics
  const totalCustomers = new Set([...orders.map(o => o.customerId), ...invoices.map(i => i.customerId)]).size;
  const activeCustomers = new Set(orders.filter(o => o.status !== 'cancelled').map(o => o.customerId)).size;
  const totalCustomerValue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageCustomerValue = totalCustomers > 0 ? totalCustomerValue / totalCustomers : 0;

  // Customer acquisition by lead status
  const leadStatusData = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const leadChartData = Object.entries(leadStatusData).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    value: count
  }));

  // Customer value distribution
  const customerValues = orders.reduce((acc, order) => {
    acc[order.customerId] = (acc[order.customerId] || 0) + order.total;
    return acc;
  }, {} as Record<string, number>);

  const valueRanges = {
    '0-100': 0,
    '101-500': 0,
    '501-1000': 0,
    '1000+': 0
  };

  Object.values(customerValues).forEach(value => {
    if (value <= 100) valueRanges['0-100']++;
    else if (value <= 500) valueRanges['101-500']++;
    else if (value <= 1000) valueRanges['501-1000']++;
    else valueRanges['1000+']++;
  });

  const valueDistributionData = Object.entries(valueRanges).map(([range, count]) => ({
    range,
    count
  }));

  // Top customers by value
  const topCustomers = Object.entries(customerValues)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([customerId, value]) => {
      const customer = orders.find(o => o.customerId === customerId);
      return {
        id: customerId,
        name: customer?.customerName || 'Unknown',
        value,
        orders: orders.filter(o => o.customerId === customerId).length
      };
    });

  // Monthly customer acquisition
  const monthlyAcquisition = leads
    .filter(lead => lead.status === 'won')
    .reduce((acc, lead) => {
      const month = new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const acquisitionChartData = Object.entries(monthlyAcquisition).map(([month, customers]) => ({
    month,
    customers
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleExportReport = () => {
    const reportData = {
      totalCustomers,
      activeCustomers,
      totalCustomerValue,
      averageCustomerValue,
      topCustomers,
      leadStatusData,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Customer Reports</h2>
        <Button onClick={handleExportReport} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCustomerValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Customer Value</CardTitle>
            <Star className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageCustomerValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {leadChartData.length > 0 ? (
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ status, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {leadChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No lead data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {valueDistributionData.some(d => d.count > 0) ? (
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valueDistributionData}>
                    <XAxis dataKey="range" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No customer value data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers by Value</CardTitle>
        </CardHeader>
        <CardContent>
          {topCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>${customer.value.toFixed(2)}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>${(customer.value / customer.orders).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No customer data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
