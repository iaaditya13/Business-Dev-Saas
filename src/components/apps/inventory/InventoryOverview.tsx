
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBusinessStore } from '@/stores/businessStore';
import { AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';

export const InventoryOverview = () => {
  const { inventory, products } = useBusinessStore();

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const outOfStockItems = inventory.filter(item => item.currentStock === 0);
  const wellStockedItems = inventory.filter(item => item.currentStock > item.minStock);

  const getStockStatus = (item: any) => {
    if (item.currentStock === 0) return { status: 'Out of Stock', color: 'destructive' };
    if (item.currentStock <= item.minStock) return { status: 'Low Stock', color: 'secondary' };
    return { status: 'In Stock', color: 'default' };
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Stock Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Well Stocked</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{wellStockedItems.length}</div>
            <p className="text-xs text-muted-foreground">Items above minimum stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items out of stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{item.productName}</h4>
                    <p className="text-sm text-muted-foreground">Location: {item.location}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="secondary">
                      {item.currentStock} / {item.minStock} min
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Details */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map(item => {
              const stockStatus = getStockStatus(item);
              const stockPercentage = getStockPercentage(item.currentStock, item.maxStock);
              
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={stockStatus.color as any}>
                        {stockStatus.status}
                      </Badge>
                      <p className="text-sm font-medium">
                        {item.currentStock} / {item.maxStock} units
                      </p>
                    </div>
                  </div>
                  <Progress value={stockPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {item.minStock}</span>
                    <span>Current: {item.currentStock}</span>
                    <span>Max: {item.maxStock}</span>
                  </div>
                </div>
              );
            })}
            
            {inventory.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No inventory items</h3>
                <p className="text-sm text-muted-foreground">Add some products to start tracking inventory</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
