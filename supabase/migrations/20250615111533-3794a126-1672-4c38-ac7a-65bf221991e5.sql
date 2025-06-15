
-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID,
  customer_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  items JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON public.invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON public.invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Expenses policies
CREATE POLICY "Users can view own expenses" ON public.expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expenses" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON public.expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON public.expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL CHECK (status IN ('new', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  value DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leads policies
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE USING (auth.uid() = user_id);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  sku TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Users can view own products" ON public.products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID,
  customer_name TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'confirmed', 'delivered', 'cancelled')),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own orders" ON public.orders
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, business_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'business_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert demo user data (this will be our demo@yourapp.com account)
-- Note: The actual user account will be created through Supabase Auth
-- This is just sample data that will be associated with the demo user once they sign up

-- We'll create a function to seed demo data for a specific user
CREATE OR REPLACE FUNCTION public.seed_demo_data(demo_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert demo invoices
  INSERT INTO public.invoices (user_id, customer_name, amount, status, due_date, items) VALUES
    (demo_user_id, 'Acme Corp', 15000.00, 'paid', CURRENT_DATE - INTERVAL '30 days', '[{"description": "Website Development", "quantity": 1, "price": 15000.00}]'),
    (demo_user_id, 'TechStart Inc', 8500.00, 'sent', CURRENT_DATE + INTERVAL '15 days', '[{"description": "Mobile App", "quantity": 1, "price": 8500.00}]'),
    (demo_user_id, 'GlobalTech Ltd', 12000.00, 'overdue', CURRENT_DATE - INTERVAL '5 days', '[{"description": "E-commerce Platform", "quantity": 1, "price": 12000.00}]'),
    (demo_user_id, 'StartupHub', 5500.00, 'paid', CURRENT_DATE - INTERVAL '20 days', '[{"description": "Consulting Services", "quantity": 10, "price": 550.00}]'),
    (demo_user_id, 'InnovateCo', 9800.00, 'sent', CURRENT_DATE + INTERVAL '10 days', '[{"description": "System Integration", "quantity": 1, "price": 9800.00}]');

  -- Insert demo expenses
  INSERT INTO public.expenses (user_id, description, amount, category, date, status) VALUES
    (demo_user_id, 'Office Rent', 3000.00, 'Rent', CURRENT_DATE - INTERVAL '15 days', 'approved'),
    (demo_user_id, 'Software Licenses', 1200.00, 'Software', CURRENT_DATE - INTERVAL '10 days', 'approved'),
    (demo_user_id, 'Marketing Campaign', 2500.00, 'Marketing', CURRENT_DATE - INTERVAL '5 days', 'pending'),
    (demo_user_id, 'Equipment Purchase', 4500.00, 'Equipment', CURRENT_DATE - INTERVAL '20 days', 'approved'),
    (demo_user_id, 'Travel Expenses', 800.00, 'Travel', CURRENT_DATE - INTERVAL '3 days', 'pending');

  -- Insert demo leads
  INSERT INTO public.leads (user_id, name, email, phone, company, status, value) VALUES
    (demo_user_id, 'John Smith', 'john@example.com', '+1234567890', 'Example Corp', 'qualified', 25000.00),
    (demo_user_id, 'Sarah Johnson', 'sarah@techfirm.com', '+1234567891', 'TechFirm LLC', 'proposal', 18000.00),
    (demo_user_id, 'Mike Davis', 'mike@startup.io', '+1234567892', 'Startup.io', 'new', 12000.00),
    (demo_user_id, 'Lisa Chen', 'lisa@innovate.com', '+1234567893', 'Innovate Solutions', 'negotiation', 35000.00),
    (demo_user_id, 'David Wilson', 'david@enterprise.com', '+1234567894', 'Enterprise Group', 'won', 45000.00);

  -- Insert demo products
  INSERT INTO public.products (user_id, name, description, price, cost, stock, category, sku) VALUES
    (demo_user_id, 'Alpha Software', 'Premium business software solution', 999.00, 400.00, 50, 'Software', 'ALPHA-001'),
    (demo_user_id, 'Beta Hardware', 'High-performance hardware device', 1499.00, 800.00, 25, 'Hardware', 'BETA-002'),
    (demo_user_id, 'Gamma Service', 'Professional consulting service', 2500.00, 1000.00, 100, 'Service', 'GAMMA-003'),
    (demo_user_id, 'Delta Module', 'Advanced system module', 750.00, 300.00, 15, 'Module', 'DELTA-004'),
    (demo_user_id, 'Epsilon Tool', 'Productivity enhancement tool', 599.00, 250.00, 8, 'Tool', 'EPSILON-005');

  -- Insert demo orders
  INSERT INTO public.orders (user_id, customer_name, items, total, status, order_date) VALUES
    (demo_user_id, 'Acme Corp', '[{"productName": "Alpha Software", "quantity": 2, "price": 999.00}]', 1998.00, 'delivered', CURRENT_DATE - INTERVAL '7 days'),
    (demo_user_id, 'TechStart Inc', '[{"productName": "Beta Hardware", "quantity": 1, "price": 1499.00}]', 1499.00, 'confirmed', CURRENT_DATE - INTERVAL '3 days'),
    (demo_user_id, 'GlobalTech Ltd', '[{"productName": "Gamma Service", "quantity": 1, "price": 2500.00}]', 2500.00, 'draft', CURRENT_DATE);
END;
$$;
