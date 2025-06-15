
import { useBusinessStore } from '@/stores/businessStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  Package, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  Plus
} from 'lucide-react';

export const BasicDashboard = () => {
  const { invoices, expenses, leads, products, orders, inventory } = useBusinessStore();

  // Calculate metrics
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalExpenses = expenses
    .filter(exp => exp.status === 'approved')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  const totalCustomers = new Set(invoices.map(inv => inv.customerId)).size;

  const topProducts = products
    .map(product => {
      const soldQuantity = orders
        .flatMap(order => order.items)
        .filter(item => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);
      return { ...product, soldQuantity };
    })
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 3);

  const recentInvoices = invoices
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Net profit: ${netProfit.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {leads.filter(lead => lead.status === 'new').length} new leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockItems.length} low stock alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              {orders.filter(order => order.status === 'confirmed').length} confirmed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get things done faster</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Invoice</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Record Expense</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Lead</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Order</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{invoice.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                      <Badge 
                        variant={
                          invoice.status === 'paid' ? 'default' :
                          invoice.status === 'overdue' ? 'destructive' : 'secondary'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No invoices yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">{expense.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${expense.amount.toLocaleString()}</p>
                      <Badge 
                        variant={
                          expense.status === 'approved' ? 'default' :
                          expense.status === 'rejected' ? 'destructive' : 'secondary'
                        }
                      >
                        {expense.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No expenses yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Low Stock Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="font-medium">{item.productName}</span>
                    <Badge variant="outline">
                      {item.currentStock} / {item.minStock} min
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Top Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="outline">
                      {product.soldQuantity} sold
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No sales data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
