
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from './authStore';

// Types from database
export interface Invoice {
  id: string;
  user_id: string;
  customer_id?: string;
  customer_name: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  updated_at: string;
  items: any[];
}

export interface Expense {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  category?: string;
  sku?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_id?: string;
  customer_name: string;
  items: any[];
  total: number;
  status: 'draft' | 'confirmed' | 'delivered' | 'cancelled';
  order_date: string;
  created_at: string;
  updated_at: string;
}

interface BusinessData {
  invoices: Invoice[];
  expenses: Expense[];
  leads: Lead[];
  products: Product[];
  orders: Order[];
}

interface SupabaseBusinessStore extends BusinessData {
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAllData: () => Promise<void>;
  
  // Invoice actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  
  // Expense actions
  addExpense: (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  
  // Lead actions
  addLead: (lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  
  // Order actions
  addOrder: (order: Omit<Order, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const useSupabaseBusinessStore = create<SupabaseBusinessStore>((set, get) => ({
  invoices: [],
  expenses: [],
  leads: [],
  products: [],
  orders: [],
  isLoading: false,
  error: null,

  fetchAllData: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });

    try {
      const [invoicesResult, expensesResult, leadsResult, productsResult, ordersResult] = await Promise.all([
        supabase.from('invoices').select('*').eq('user_id', user.id),
        supabase.from('expenses').select('*').eq('user_id', user.id),
        supabase.from('leads').select('*').eq('user_id', user.id),
        supabase.from('products').select('*').eq('user_id', user.id),
        supabase.from('orders').select('*').eq('user_id', user.id)
      ]);

      set({
        invoices: invoicesResult.data || [],
        expenses: expensesResult.data || [],
        leads: leadsResult.data || [],
        products: productsResult.data || [],
        orders: ordersResult.data || [],
        isLoading: false
      });
    } catch (error) {
      set({ error: 'Failed to fetch data', isLoading: false });
      console.error('Error fetching data:', error);
    }
  },

  addInvoice: async (invoice) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{ ...invoice, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        invoices: [...state.invoices, data]
      }));
    } catch (error) {
      console.error('Error adding invoice:', error);
      set({ error: 'Failed to add invoice' });
    }
  },

  updateInvoice: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        invoices: state.invoices.map(inv => inv.id === id ? data : inv)
      }));
    } catch (error) {
      console.error('Error updating invoice:', error);
      set({ error: 'Failed to update invoice' });
    }
  },

  addExpense: async (expense) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        expenses: [...state.expenses, data]
      }));
    } catch (error) {
      console.error('Error adding expense:', error);
      set({ error: 'Failed to add expense' });
    }
  },

  addLead: async (lead) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ ...lead, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        leads: [...state.leads, data]
      }));
    } catch (error) {
      console.error('Error adding lead:', error);
      set({ error: 'Failed to add lead' });
    }
  },

  updateLead: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        leads: state.leads.map(lead => lead.id === id ? data : lead)
      }));
    } catch (error) {
      console.error('Error updating lead:', error);
      set({ error: 'Failed to update lead' });
    }
  },

  addProduct: async (product) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{ ...product, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        products: [...state.products, data]
      }));
    } catch (error) {
      console.error('Error adding product:', error);
      set({ error: 'Failed to add product' });
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        products: state.products.map(product => product.id === id ? data : product)
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      set({ error: 'Failed to update product' });
    }
  },

  addOrder: async (order) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{ ...order, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        orders: [...state.orders, data]
      }));
    } catch (error) {
      console.error('Error adding order:', error);
      set({ error: 'Failed to add order' });
    }
  }
}));
