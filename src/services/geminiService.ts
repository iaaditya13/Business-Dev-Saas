
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAYgUo2NwMHpxzUDgHB2d7kN-cwe9mlO7o';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generateResponse(
    message: string, 
    businessContext?: any,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      // Build context from business data
      let contextPrompt = '';
      if (businessContext) {
        contextPrompt = `
Business Context:
- Total Invoices: ${businessContext.invoices?.length || 0}
- Total Revenue: $${this.calculateTotalRevenue(businessContext.invoices || [])}
- Outstanding Invoices: ${this.getOutstandingInvoices(businessContext.invoices || []).length}
- Total Expenses: $${this.calculateTotalExpenses(businessContext.expenses || [])}
- Active Leads: ${businessContext.leads?.length || 0}
- Products in Catalog: ${businessContext.products?.length || 0}
- Current Orders: ${businessContext.orders?.length || 0}
- Low Stock Items: ${this.getLowStockItems(businessContext.inventory || []).length}

Recent Activity:
${this.getRecentActivity(businessContext)}

You are an AI business assistant helping with this business management platform. Answer questions about the business data, provide insights, and suggest actions based on the current state of the business.
`;
      }

      // Build conversation history
      const conversationContext = conversationHistory
        .slice(-5) // Last 5 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `${contextPrompt}

Previous conversation:
${conversationContext}

Current question: ${message}

Please provide a helpful response as a business assistant.`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private calculateTotalRevenue(invoices: any[]): number {
    return invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }

  private calculateTotalExpenses(expenses: any[]): number {
    return expenses
      .filter(exp => exp.status === 'approved')
      .reduce((sum, exp) => sum + exp.amount, 0);
  }

  private getOutstandingInvoices(invoices: any[]): any[] {
    return invoices.filter(inv => ['sent', 'overdue'].includes(inv.status));
  }

  private getLowStockItems(inventory: any[]): any[] {
    return inventory.filter(item => item.currentStock <= item.minStock);
  }

  private getRecentActivity(businessContext: any): string {
    const activities = [];
    
    // Recent invoices
    const recentInvoices = (businessContext.invoices || [])
      .slice(-3)
      .map(inv => `Invoice ${inv.id} for $${inv.amount} (${inv.status})`);
    
    // Recent expenses
    const recentExpenses = (businessContext.expenses || [])
      .slice(-3)
      .map(exp => `Expense: ${exp.description} $${exp.amount}`);
    
    // Recent leads
    const recentLeads = (businessContext.leads || [])
      .slice(-3)
      .map(lead => `Lead: ${lead.name} (${lead.status}) - $${lead.value}`);

    activities.push(...recentInvoices, ...recentExpenses, ...recentLeads);
    
    return activities.slice(0, 5).join('\n') || 'No recent activity';
  }
}

export const geminiService = new GeminiService();
