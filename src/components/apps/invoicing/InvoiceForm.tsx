
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBusinessStore, InvoiceItem } from '@/stores/businessStore';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceFormData {
  customerName: string;
  customerId: string;
  dueDate: string;
}

export const InvoiceForm = () => {
  const { addInvoice } = useBusinessStore();
  const { toast } = useToast();
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, price: 0, total: 0 }
  ]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InvoiceFormData>();

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const onSubmit = (data: InvoiceFormData) => {
    const invoice = {
      customerId: data.customerId,
      customerName: data.customerName,
      amount: calculateTotal(),
      status: 'draft' as const,
      dueDate: data.dueDate,
      items: items.filter(item => item.description.trim() !== '')
    };

    addInvoice(invoice);
    toast({
      title: "Invoice created",
      description: "Your invoice has been created successfully."
    });
    
    reset();
    setItems([{ id: '1', description: '', quantity: 1, price: 0, total: 0 }]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                {...register('customerName', { required: 'Customer name is required' })}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="text-sm text-red-600">{errors.customerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                {...register('customerId', { required: 'Customer ID is required' })}
                placeholder="Enter customer ID"
              />
              {errors.customerId && (
                <p className="text-sm text-red-600">{errors.customerId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate', { required: 'Due date is required' })}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Total</Label>
                    <Input
                      value={`$${item.total.toFixed(2)}`}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-lg font-medium">
                  Total: ${calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Cancel
            </Button>
            <Button type="submit">
              Create Invoice
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
