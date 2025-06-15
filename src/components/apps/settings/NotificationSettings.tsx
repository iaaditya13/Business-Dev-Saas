
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: {
      invoices: true,
      payments: true,
      reminders: true,
      reports: false,
      marketing: false
    },
    push: {
      newOrders: true,
      lowStock: true,
      systemUpdates: true,
      security: true
    },
    inApp: {
      mentions: true,
      tasks: true,
      deadlines: true,
      teamUpdates: false
    }
  });

  const handleSave = () => {
    console.log('Saving notification settings:', notifications);
    toast({
      title: "Settings Saved",
      description: "Notification preferences have been updated."
    });
  };

  const updateEmailNotification = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }));
  };

  const updatePushNotification = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      push: { ...prev.push, [key]: value }
    }));
  };

  const updateInAppNotification = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      inApp: { ...prev.inApp, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Invoice Updates</Label>
              <p className="text-sm text-muted-foreground">New invoices and payment confirmations</p>
            </div>
            <Switch
              checked={notifications.email.invoices}
              onCheckedChange={(checked) => updateEmailNotification('invoices', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Payment Notifications</Label>
              <p className="text-sm text-muted-foreground">Payment received and failed transactions</p>
            </div>
            <Switch
              checked={notifications.email.payments}
              onCheckedChange={(checked) => updateEmailNotification('payments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Reminders</Label>
              <p className="text-sm text-muted-foreground">Due date and follow-up reminders</p>
            </div>
            <Switch
              checked={notifications.email.reminders}
              onCheckedChange={(checked) => updateEmailNotification('reminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Summary of business activities</p>
            </div>
            <Switch
              checked={notifications.email.reports}
              onCheckedChange={(checked) => updateEmailNotification('reports', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">Product updates and promotional content</p>
            </div>
            <Switch
              checked={notifications.email.marketing}
              onCheckedChange={(checked) => updateEmailNotification('marketing', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Push Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>New Orders</Label>
              <p className="text-sm text-muted-foreground">Instant notifications for new orders</p>
            </div>
            <Switch
              checked={notifications.push.newOrders}
              onCheckedChange={(checked) => updatePushNotification('newOrders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">When inventory runs low</p>
            </div>
            <Switch
              checked={notifications.push.lowStock}
              onCheckedChange={(checked) => updatePushNotification('lowStock', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>System Updates</Label>
              <p className="text-sm text-muted-foreground">Maintenance and feature updates</p>
            </div>
            <Switch
              checked={notifications.push.systemUpdates}
              onCheckedChange={(checked) => updatePushNotification('systemUpdates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Important security notifications</p>
            </div>
            <Switch
              checked={notifications.push.security}
              onCheckedChange={(checked) => updatePushNotification('security', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>In-App Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mentions</Label>
              <p className="text-sm text-muted-foreground">When someone mentions you</p>
            </div>
            <Switch
              checked={notifications.inApp.mentions}
              onCheckedChange={(checked) => updateInAppNotification('mentions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Task Updates</Label>
              <p className="text-sm text-muted-foreground">Task assignments and completions</p>
            </div>
            <Switch
              checked={notifications.inApp.tasks}
              onCheckedChange={(checked) => updateInAppNotification('tasks', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Deadline Reminders</Label>
              <p className="text-sm text-muted-foreground">Upcoming project deadlines</p>
            </div>
            <Switch
              checked={notifications.inApp.deadlines}
              onCheckedChange={(checked) => updateInAppNotification('deadlines', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Team Updates</Label>
              <p className="text-sm text-muted-foreground">Team member activities</p>
            </div>
            <Switch
              checked={notifications.inApp.teamUpdates}
              onCheckedChange={(checked) => updateInAppNotification('teamUpdates', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};
