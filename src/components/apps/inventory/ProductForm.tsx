
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBusinessStore } from '@/stores/businessStore';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus } from 'lucide-react';

export const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    stock: '',
    category: '',
    sku: '',
    minStock: '',
    maxStock: '',
    location: 'Main Warehouse'
  });

  const { addProduct } = useBusinessStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.cost || !formData.stock || !formData.sku) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      category: formData.category || 'General',
      sku: formData.sku
    };

    addProduct(product);

    toast({
      title: "Success",
      description: "Product added successfully"
    });

    setFormData({
      name: '',
      description: '',
      price: '',
      cost: '',
      stock: '',
      category: '',
      sku: '',
      minStock: '',
      maxStock: '',
      location: 'Main Warehouse'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Enter SKU (e.g., PROD-001)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Enter category"
                />
              </div>
            </div>

            {/* Pricing and Stock */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing & Stock</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost Price *</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => handleInputChange('minStock', e.target.value)}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStock">Maximum Stock</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => handleInputChange('maxStock', e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Main Warehouse"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setFormData({
              name: '',
              description: '',
              price: '',
              cost: '',
              stock: '',
              category: '',
              sku: '',
              minStock: '',
              maxStock: '',
              location: 'Main Warehouse'
            })}>
              Reset
            </Button>
            <Button type="submit">
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
