
import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  Users, 
  Package, 
  Store, 
  TrendingUp, 
  Settings, 
  Calendar, 
  MessageSquare, 
  Shield, 
  BarChart3 
} from 'lucide-react';

export interface AppConfig {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  color: string;
  route: string;
}

export const apps: AppConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Business overview and analytics',
    icon: LayoutDashboard,
    category: 'Overview',
    color: 'bg-blue-500',
    route: '/dashboard'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Manage your finances and bookkeeping',
    icon: Calculator,
    category: 'Finance',
    color: 'bg-blue-500',
    route: '/finance/accounting'
  },
  {
    id: 'invoicing',
    name: 'Invoicing',
    description: 'Create and send professional invoices',
    icon: FileText,
    category: 'Finance',
    color: 'bg-green-500',
    route: '/finance/invoicing'
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Customer relationship management',
    icon: Users,
    category: 'Sales',
    color: 'bg-purple-500',
    route: '/sales/crm'
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Track your stock and products',
    icon: Package,
    category: 'Supply Chain',
    color: 'bg-orange-500',
    route: '/supply/inventory'
  },
  {
    id: 'pos-shop',
    name: 'POS Shop',
    description: 'Point of sale for retail',
    icon: Store,
    category: 'Sales',
    color: 'bg-red-500',
    route: '/sales/pos-shop'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Business insights and reports',
    icon: TrendingUp,
    category: 'Analytics',
    color: 'bg-indigo-500',
    route: '/analytics'
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configure your workspace',
    icon: Settings,
    category: 'System',
    color: 'bg-gray-500',
    route: '/settings'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Schedule and appointments',
    icon: Calendar,
    category: 'Productivity',
    color: 'bg-teal-500',
    route: '/calendar'
  },
  {
    id: 'messaging',
    name: 'Messaging',
    description: 'Internal team communication',
    icon: MessageSquare,
    category: 'Communication',
    color: 'bg-pink-500',
    route: '/messaging'
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Access control and permissions',
    icon: Shield,
    category: 'System',
    color: 'bg-yellow-500',
    route: '/security'
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Generate business reports',
    icon: BarChart3,
    category: 'Analytics',
    color: 'bg-cyan-500',
    route: '/reports'
  }
];
