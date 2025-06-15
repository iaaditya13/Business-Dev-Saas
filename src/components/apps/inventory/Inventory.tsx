
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryOverview } from './InventoryOverview';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { StockMovements } from './StockMovements';
import { useBusinessStore } from '@/stores/businessStore';
import { Package, Plus, TrendingUp, AlertTriangle } from 'lucide-react';

export const Inventory = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { products, inventory } = useBusinessStore();

  const totalProducts = products.length;
  const totalStock = inventory.reduce((sum, item) => sum + item.currentStock, 0);
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock).length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your products and stock levels</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Units in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add-product">Add Product</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <InventoryOverview />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductList />
        </TabsContent>

        <TabsContent value="add-product" className="space-y-4">
          <ProductForm />
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <StockMovements />
        </TabsContent>
      </Tabs>
    </div>
  );
};
