
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Finance Types
export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
}

// Sales Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  sku: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'draft' | 'confirmed' | 'delivered' | 'cancelled';
  orderDate: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

// Supply Chain Types
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastUpdated: string;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  items: PurchaseOrderItem[];
  total: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received';
  orderDate: string;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface BusinessStore {
  // Finance
  invoices: Invoice[];
  expenses: Expense[];
  journalEntries: JournalEntry[];
  
  // Sales
  leads: Lead[];
  products: Product[];
  orders: Order[];
  
  // Supply Chain
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  
  // Actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateInventory: (productId: string, stockChange: number) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
}

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      expenses: [],
      journalEntries: [],
      leads: [],
      products: [],
      orders: [],
      inventory: [],
      purchaseOrders: [],
      
      addInvoice: (invoice) => {
        const newInvoice = {
          ...invoice,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        set((state) => ({ invoices: [...state.invoices, newInvoice] }));
      },
      
      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map(inv => 
            inv.id === id ? { ...inv, ...updates } : inv
          )
        }));
      },
      
      addExpense: (expense) => {
        const newExpense = {
          ...expense,
          id: Date.now().toString()
        };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
      },
      
      addLead: (lead) => {
        const newLead = {
          ...lead,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        set((state) => ({ leads: [...state.leads, newLead] }));
      },
      
      updateLead: (id, updates) => {
        set((state) => ({
          leads: state.leads.map(lead => 
            lead.id === id ? { ...lead, ...updates } : lead
          )
        }));
      },
      
      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: Date.now().toString()
        };
        set((state) => ({ products: [...state.products, newProduct] }));
        
        // Also add to inventory
        const inventoryItem: InventoryItem = {
          id: newProduct.id + '_inv',
          productId: newProduct.id,
          productName: newProduct.name,
          currentStock: newProduct.stock,
          minStock: 10,
          maxStock: 100,
          location: 'Main Warehouse',
          lastUpdated: new Date().toISOString()
        };
        set((state) => ({ inventory: [...state.inventory, inventoryItem] }));
      },
      
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map(product => 
            product.id === id ? { ...product, ...updates } : product
          )
        }));
      },
      
      addOrder: (order) => {
        const newOrder = {
          ...order,
          id: Date.now().toString()
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
        
        // Update inventory
        order.items.forEach(item => {
          get().updateInventory(item.productId, -item.quantity);
        });
      },
      
      updateInventory: (productId, stockChange) => {
        set((state) => ({
          inventory: state.inventory.map(item =>
            item.productId === productId
              ? { 
                  ...item, 
                  currentStock: Math.max(0, item.currentStock + stockChange),
                  lastUpdated: new Date().toISOString()
                }
              : item
          )
        }));
      },
      
      addPurchaseOrder: (po) => {
        const newPO = {
          ...po,
          id: Date.now().toString()
        };
        set((state) => ({ purchaseOrders: [...state.purchaseOrders, newPO] }));
      }
    }),
    {
      name: 'business-storage'
    }
  )
);
