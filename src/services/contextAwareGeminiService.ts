import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSupabaseBusinessStore } from '@/stores/supabaseBusinessStore';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface BusinessContext {
  totalRevenue: number;
  outstandingInvoices: number;
  inventoryItems: number;
  activeLeads: number;
  lowStockProducts: string[];
  recentExpenses: number;
  topProducts: string[];
  salesTrend: string;
}

class ContextAwareGeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private isInitialized = false;
  private readonly apiKey = 'AIzaSyAYgUo2NwMHpxzUDgHB2d7kN-cwe9mlO7o';

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;
    
    console.log('Initializing Gemini service with permanent API key...');
    
    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      this.isInitialized = true;
      console.log('Gemini service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
    }
  }

  public isAvailable(): boolean {
    return this.isInitialized && !!this.model;
  }

  private generateBusinessContext(): BusinessContext {
    const store = useSupabaseBusinessStore.getState();
    const { invoices, expenses, leads, products, orders } = store;

    // Calculate total revenue from paid invoices
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Count outstanding invoices
    const outstandingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length;

    // Count inventory items
    const inventoryItems = products.length;

    // Count active leads
    const activeLeads = leads.filter(lead => 
      ['new', 'qualified', 'proposal', 'negotiation'].includes(lead.status)
    ).length;

    // Find low stock products (stock < 10)
    const lowStockProducts = products
      .filter(product => product.stock < 10)
      .map(product => product.name);

    // Calculate recent expenses (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentExpenses = expenses
      .filter(expense => new Date(expense.date) >= thirtyDaysAgo)
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Get top products by recent orders
    const productSales = new Map<string, number>();
    orders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const current = productSales.get(item.productName) || 0;
          productSales.set(item.productName, current + (item.quantity || 1));
        });
      }
    });

    const topProducts = Array.from(productSales.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    // Determine sales trend
    const salesTrend = this.calculateSalesTrend(orders);

    return {
      totalRevenue,
      outstandingInvoices,
      inventoryItems,
      activeLeads,
      lowStockProducts,
      recentExpenses,
      topProducts,
      salesTrend
    };
  }

  private calculateSalesTrend(orders: any[]): string {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentOrders = orders.filter(order => 
      new Date(order.order_date) >= thirtyDaysAgo
    ).length;

    const previousOrders = orders.filter(order => {
      const orderDate = new Date(order.order_date);
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
    }).length;

    if (recentOrders > previousOrders) {
      return 'increasing';
    } else if (recentOrders < previousOrders) {
      return 'decreasing';
    } else {
      return 'stable';
    }
  }

  private createContextualPrompt(userMessage: string, context: BusinessContext): string {
    return `You are an AI business assistant for a user's business management platform. You have access to real-time business data and should provide insights based on this data.

CURRENT BUSINESS DATA:
- Total Revenue: $${context.totalRevenue.toFixed(2)}
- Outstanding Invoices: ${context.outstandingInvoices}
- Inventory Items: ${context.inventoryItems}
- Active Leads: ${context.activeLeads}
- Low Stock Products: ${context.lowStockProducts.length > 0 ? context.lowStockProducts.join(', ') : 'None'}
- Recent Expenses (30 days): $${context.recentExpenses.toFixed(2)}
- Top Products: ${context.topProducts.length > 0 ? context.topProducts.join(', ') : 'No sales data'}
- Sales Trend: ${context.salesTrend}

INSTRUCTIONS:
- Always reference the actual business data when providing insights
- Provide actionable recommendations based on the data
- If asked about specific metrics, use the exact numbers from the context
- Focus on business growth and efficiency improvements
- Be concise but informative

USER MESSAGE: ${userMessage}

Please respond as a knowledgeable business advisor using the provided data context.`;
  }

  async generateResponse(
    userMessage: string,
    businessData: any, // Legacy parameter, now ignored
    chatHistory: ChatMessage[] = []
  ): Promise<string> {
    if (!this.isInitialized || !this.model) {
      throw new Error('AI Assistant is not available.');
    }

    try {
      // Generate real-time business context
      const context = this.generateBusinessContext();
      
      // Create contextual prompt
      const contextualPrompt = this.createContextualPrompt(userMessage, context);

      // Build conversation history for context
      const conversation = chatHistory.slice(-5).map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

      const fullPrompt = conversation ? 
        `${contextualPrompt}\n\nRECENT CONVERSATION:\n${conversation}` : 
        contextualPrompt;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }
}

export const contextAwareGeminiService = new ContextAwareGeminiService();
