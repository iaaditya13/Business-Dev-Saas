
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBusinessStore } from '@/stores/businessStore';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export const CustomerList = () => {
  const { invoices } = useBusinessStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  // Extract unique customers from invoices
  const customers: Customer[] = Array.from(
    new Map(
      invoices.map(invoice => [
        invoice.customerId,
        {
          id: invoice.customerId,
          name: invoice.customerName,
          email: '',
          phone: '',
          company: ''
        }
      ])
    ).values()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a customers store
    console.log('Customer data:', formData);
    setFormData({ name: '', email: '', phone: '', company: '' });
    setShowForm(false);
  };

  const getCustomerInvoiceCount = (customerId: string) => {
    return invoices.filter(inv => inv.customerId === customerId).length;
  };

  const getCustomerTotalAmount = (customerId: string) => {
    return invoices
      .filter(inv => inv.customerId === customerId && inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Management</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Add Customer</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {customers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No customers found</p>
              <p className="text-sm text-muted-foreground">Customers will appear here when you create invoices</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Invoices</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-mono">#{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{getCustomerInvoiceCount(customer.id)}</TableCell>
                    <TableCell className="font-medium">
                      ${getCustomerTotalAmount(customer.id).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
