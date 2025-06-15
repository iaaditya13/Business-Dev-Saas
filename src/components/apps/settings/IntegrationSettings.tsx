
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Zap, Database, CreditCard, Mail, Webhook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const IntegrationSettings = () => {
  const { toast } = useToast();

  const integrations = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Accept payments and manage subscriptions',
      icon: CreditCard,
      connected: true,
      color: 'bg-blue-500'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing and automation',
      icon: Mail,
      connected: false,
      color: 'bg-yellow-500'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows with 3000+ apps',
      icon: Zap,
      connected: true,
      color: 'bg-orange-500'
    },
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'Database and authentication service',
      icon: Database,
      connected: false,
      color: 'bg-green-500'
    }
  ];

  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: 'Invoice Created',
      url: 'https://api.example.com/webhooks/invoice',
      active: true
    },
    {
      id: 2,
      name: 'Payment Received',
      url: 'https://api.example.com/webhooks/payment',
      active: false
    }
  ]);

  const [newWebhook, setNewWebhook] = useState({ name: '', url: '' });

  const handleToggleIntegration = (integrationId: string) => {
    console.log('Toggling integration:', integrationId);
    toast({
      title: "Integration Updated",
      description: "Integration status has been updated."
    });
  };

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast({
        title: "Error",
        description: "Please fill in all webhook fields.",
        variant: "destructive"
      });
      return;
    }

    const webhook = {
      id: webhooks.length + 1,
      name: newWebhook.name,
      url: newWebhook.url,
      active: true
    };

    setWebhooks([...webhooks, webhook]);
    setNewWebhook({ name: '', url: '' });
    toast({
      title: "Webhook Added",
      description: "New webhook has been created successfully."
    });
  };

  const toggleWebhook = (id: number) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === id ? { ...webhook, active: !webhook.active } : webhook
    ));
  };

  const deleteWebhook = (id: number) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    toast({
      title: "Webhook Deleted",
      description: "Webhook has been removed."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Third-Party Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded">
              <div className="flex items-center space-x-4">
                <div className={`${integration.color} p-3 rounded-lg`}>
                  <integration.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={integration.connected ? "default" : "secondary"}>
                  {integration.connected ? "Connected" : "Disconnected"}
                </Badge>
                <Button
                  variant={integration.connected ? "outline" : "default"}
                  onClick={() => handleToggleIntegration(integration.id)}
                >
                  {integration.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="h-5 w-5" />
            <span>Webhooks</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="webhookName">Webhook Name</Label>
              <Input
                id="webhookName"
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                placeholder="e.g. Invoice Created"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                placeholder="https://api.example.com/webhook"
              />
            </div>
          </div>
          <Button onClick={handleAddWebhook}>
            Add Webhook
          </Button>

          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{webhook.name}</p>
                  <p className="text-sm text-muted-foreground">{webhook.url}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={webhook.active}
                    onCheckedChange={() => toggleWebhook(webhook.id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteWebhook(webhook.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
