
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBusinessStore } from '@/stores/businessStore';
import { DollarSign, Users } from 'lucide-react';

export const LeadPipeline = () => {
  const { leads } = useBusinessStore();

  const stages = [
    { key: 'new', label: 'New Leads', color: 'bg-blue-500' },
    { key: 'qualified', label: 'Qualified', color: 'bg-green-500' },
    { key: 'proposal', label: 'Proposal', color: 'bg-yellow-500' },
    { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
    { key: 'won', label: 'Won', color: 'bg-emerald-500' },
    { key: 'lost', label: 'Lost', color: 'bg-red-500' }
  ];

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const getStageValue = (status: string) => {
    return leads
      .filter(lead => lead.status === status)
      .reduce((sum, lead) => sum + lead.value, 0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map(stage => {
          const stageLeads = getLeadsByStatus(stage.key);
          const stageValue = getStageValue(stage.key);
          
          return (
            <Card key={stage.key} className="min-h-[400px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{stage.label}</CardTitle>
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {stageLeads.length} leads
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    ${stageValue.toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {stageLeads.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No leads in this stage
                  </p>
                ) : (
                  stageLeads.map(lead => (
                    <Card key={lead.id} className="p-3 bg-muted/50">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{lead.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            ${lead.value.toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{leads.length}</p>
              <p className="text-sm text-muted-foreground">Total Leads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                ${leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Pipeline Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {leads.filter(lead => lead.status === 'won').length}
              </p>
              <p className="text-sm text-muted-foreground">Won Deals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {leads.length > 0 
                  ? ((leads.filter(lead => lead.status === 'won').length / leads.length) * 100).toFixed(1)
                  : '0'
                }%
              </p>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
