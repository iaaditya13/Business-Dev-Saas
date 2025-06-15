
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBusinessStore } from '@/stores/businessStore';
import { Search, Edit, Package, DollarSign } from 'lucide-react';

export const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, inventory, updateProduct } = useBusinessStore();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInventoryInfo = (productId: string) => {
    return inventory.find(item => item.productId === productId);
  };

  const getStockStatus = (productId: string) => {
    const inventoryItem = getInventoryInfo(productId);
    if (!inventoryItem) return { status: 'No Inventory', color: 'secondary' };
    
    if (inventoryItem.currentStock === 0) return { status: 'Out of Stock', color: 'destructive' };
    if (inventoryItem.currentStock <= inventoryItem.minStock) return { status: 'Low Stock', color: 'secondary' };
    return { status: 'In Stock', color: 'default' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name, category, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                {searchTerm ? 'No products found' : 'No products available'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search criteria' : 'Add some products to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => {
                const inventoryInfo = getInventoryInfo(product.id);
                const stockStatus = getStockStatus(product.id);
                
                return (
                  <div key={product.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Badge variant={stockStatus.color as any}>
                            {stockStatus.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{product.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>SKU: {product.sku}</span>
                          <span>Category: {product.category}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Price</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">${product.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Cost</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-red-600" />
                          <span className="font-semibold">${product.cost.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Current Stock</p>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">
                            {inventoryInfo ? inventoryInfo.currentStock : product.stock}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <span className="font-semibold">
                          {inventoryInfo ? inventoryInfo.location : 'Not tracked'}
                        </span>
                      </div>
                    </div>

                    {inventoryInfo && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Min Stock: </span>
                            <span className="font-medium">{inventoryInfo.minStock}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Stock: </span>
                            <span className="font-medium">{inventoryInfo.maxStock}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Updated: </span>
                            <span className="font-medium">
                              {new Date(inventoryInfo.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
