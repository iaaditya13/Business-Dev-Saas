
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useBusinessStore } from '@/stores/businessStore';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';

export const StockMovements = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const { products, inventory, updateInventory } = useBusinessStore();
  const { toast } = useToast();

  // Mock stock movements data (in a real app, this would come from the store)
  const [stockMovements] = useState([
    {
      id: '1',
      productName: 'Sample Product',
      type: 'in' as const,
      quantity: 50,
      reason: 'Purchase Order #PO-001',
      date: new Date().toISOString(),
      remainingStock: 150
    },
    {
      id: '2',
      productName: 'Sample Product',
      type: 'out' as const,
      quantity: 10,
      reason: 'Sale Order #SO-001',
      date: new Date(Date.now() - 86400000).toISOString(),
      remainingStock: 100
    }
  ]);

  const handleStockMovement = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const quantityNum = parseInt(quantity);
    const adjustedQuantity = movementType === 'out' ? -quantityNum : quantityNum;
    
    updateInventory(selectedProduct, adjustedQuantity);

    toast({
      title: "Success",
      description: `Stock ${movementType === 'in' ? 'added' : 'removed'} successfully`
    });

    setSelectedProduct('');
    setQuantity('');
    setReason('');
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getCurrentStock = (productId: string) => {
    const inventoryItem = inventory.find(item => item.productId === productId);
    return inventoryItem ? inventoryItem.currentStock : 0;
  };

  return (
    <div className="space-y-6">
      {/* Stock Movement Form */}
      <Card>
        <CardHeader>
          <CardTitle>Record Stock Movement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStockMovement} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <select
                  id="product"
                  className="w-full p-2 border rounded-md"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Current: {getCurrentStock(product.id)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="movementType">Movement Type</Label>
                <select
                  id="movementType"
                  className="w-full p-2 border rounded-md"
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as 'in' | 'out')}
                >
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Purchase Order, Sale, Adjustment"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              {movementType === 'in' ? (
                <TrendingUp className="h-4 w-4 mr-2" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-2" />
              )}
              Record {movementType === 'in' ? 'Stock In' : 'Stock Out'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Stock Movement History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          {stockMovements.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No stock movements</h3>
              <p className="text-sm text-muted-foreground">Stock movements will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stockMovements.map(movement => (
                <div key={movement.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{movement.productName}</h4>
                      <Badge variant={movement.type === 'in' ? 'default' : 'secondary'}>
                        {movement.type === 'in' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {movement.type === 'in' ? '+' : '-'}{movement.quantity} units
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Remaining: {movement.remainingStock}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Reason: {movement.reason}</p>
                    <p>Date: {new Date(movement.date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
