
import { useBusinessStore } from '@/stores/businessStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Package, ShoppingCart, TrendingUp, Star } from 'lucide-react';

const chartConfig = {
  quantity: {
    label: 'Quantity Sold',
    color: 'hsl(var(--chart-1))',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-2))',
  },
  orders: {
    label: 'Orders',
    color: 'hsl(var(--chart-3))',
  },
};

export const SalesAnalytics = () => {
  const { products, orders } = useBusinessStore();

  // Calculate product performance
  const productPerformance = () => {
    const performance = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!performance[item.productId]) {
          performance[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
            orders: 0
          };
        }
        performance[item.productId].quantity += item.quantity;
        performance[item.productId].revenue += item.total;
        performance[item.productId].orders += 1;
      });
    });

    return Object.values(performance)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Calculate sales by month
  const monthlySales = () => {
    const months = {};
    
    orders.forEach(order => {
      if (order.status === 'delivered') {
        const month = new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!months[month]) {
          months[month] = { month, orders: 0, revenue: 0, items: 0 };
        }
        months[month].orders += 1;
        months[month].revenue += order.total;
        months[month].items += order.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    });

    return Object.values(months).sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  // Calculate order status distribution
  const orderStatusData = () => {
    const statuses = {};
    orders.forEach(order => {
      if (!statuses[order.status]) {
        statuses[order.status] = { name: order.status, value: 0 };
      }
      statuses[order.status].value += 1;
    });
    return Object.values(statuses);
  };

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const totalRevenue = orders.filter(order => order.status === 'delivered').reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = deliveredOrders > 0 ? totalRevenue / deliveredOrders : 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {deliveredOrders} delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From delivered orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per delivered order</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productPerformance().length}</div>
            <p className="text-xs text-muted-foreground">Unique products</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Sales Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Trend</CardTitle>
          <CardDescription>Revenue and order count over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={monthlySales()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" name="Revenue" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" name="Orders" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={productPerformance()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" name="Revenue" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={orderStatusData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Table */}
      {productPerformance().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Product Performance</CardTitle>
            <CardDescription>Complete breakdown of product sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productPerformance().map((product: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.quantity} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.orders} orders
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
