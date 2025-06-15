
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LeadForm } from './LeadForm';
import { LeadList } from './LeadList';
import { LeadPipeline } from './LeadPipeline';
import { useBusinessStore } from '@/stores/businessStore';
import { Users, DollarSign, TrendingUp, Target } from 'lucide-react';

export const CRM = () => {
  const { leads } = useBusinessStore();
  const [activeTab, setActiveTab] = useState('overview');

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
  const wonDeals = leads.filter(lead => lead.status === 'won').length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const wonValue = leads.filter(lead => lead.status === 'won').reduce((sum, lead) => sum + lead.value, 0);

  const conversionRate = totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Relationship Management</h1>
          <p className="text-muted-foreground">Manage your sales pipeline and customer relationships</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {qualifiedLeads} qualified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total opportunity value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonDeals}</div>
            <p className="text-xs text-muted-foreground">
              ${wonValue.toLocaleString()} revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Leads to customers
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">All Leads</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="add-lead">Add Lead</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.company}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          lead.status === 'won' ? 'default' :
                          lead.status === 'qualified' ? 'secondary' :
                          'outline'
                        }>
                          {lead.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          ${lead.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {leads.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No leads yet. Add your first lead to get started.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map(status => {
                    const count = leads.filter(lead => lead.status === status).length;
                    const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : '0';
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{status}</Badge>
                          <span className="text-sm">{count} leads</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads">
          <LeadList />
        </TabsContent>

        <TabsContent value="pipeline">
          <LeadPipeline />
        </TabsContent>

        <TabsContent value="add-lead">
          <LeadForm onSuccess={() => setActiveTab('leads')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
