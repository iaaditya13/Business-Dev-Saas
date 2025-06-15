
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock, Globe, Building, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessRule {
  id: string;
  name: string;
  resource: string;
  action: string;
  condition: string;
  enabled: boolean;
  priority: number;
}

interface IPRule {
  id: string;
  ipAddress: string;
  type: 'allow' | 'deny';
  description: string;
  enabled: boolean;
}

export const AccessControl = () => {
  const { toast } = useToast();
  
  const [accessRules, setAccessRules] = useState<AccessRule[]>([
    {
      id: '1',
      name: 'Admin Full Access',
      resource: '*',
      action: '*',
      condition: 'role == "Admin"',
      enabled: true,
      priority: 1
    },
    {
      id: '2',
      name: 'Manager Finance Access',
      resource: '/finance/*',
      action: 'read,write',
      condition: 'role == "Manager" AND department == "Finance"',
      enabled: true,
      priority: 2
    },
    {
      id: '3',
      name: 'User Read Only',
      resource: '/dashboard',
      action: 'read',
      condition: 'role == "User"',
      enabled: true,
      priority: 3
    }
  ]);

  const [ipRules, setIpRules] = useState<IPRule[]>([
    {
      id: '1',
      ipAddress: '192.168.1.0/24',
      type: 'allow',
      description: 'Company network',
      enabled: true
    },
    {
      id: '2',
      ipAddress: '10.0.0.0/8',
      type: 'allow',
      description: 'VPN network',
      enabled: true
    },
    {
      id: '3',
      ipAddress: '203.0.113.0/24',
      type: 'deny',
      description: 'Blocked network',
      enabled: true
    }
  ]);

  const [settings, setSettings] = useState({
    requireMFA: true,
    sessionTimeout: 480,
    maxLoginAttempts: 3,
    ipWhitelistEnabled: false,
    geoBlocking: false
  });

  const [newAccessRule, setNewAccessRule] = useState({
    name: '',
    resource: '',
    action: '',
    condition: ''
  });

  const [newIpRule, setNewIpRule] = useState({
    ipAddress: '',
    type: 'allow' as 'allow' | 'deny',
    description: ''
  });

  const handleAddAccessRule = () => {
    if (!newAccessRule.name || !newAccessRule.resource || !newAccessRule.action) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const rule: AccessRule = {
      id: Date.now().toString(),
      name: newAccessRule.name,
      resource: newAccessRule.resource,
      action: newAccessRule.action,
      condition: newAccessRule.condition,
      enabled: true,
      priority: accessRules.length + 1
    };

    setAccessRules([...accessRules, rule]);
    setNewAccessRule({ name: '', resource: '', action: '', condition: '' });
    
    toast({
      title: "Access Rule Added",
      description: "New access rule has been created."
    });
  };

  const handleAddIpRule = () => {
    if (!newIpRule.ipAddress || !newIpRule.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const rule: IPRule = {
      id: Date.now().toString(),
      ipAddress: newIpRule.ipAddress,
      type: newIpRule.type,
      description: newIpRule.description,
      enabled: true
    };

    setIpRules([...ipRules, rule]);
    setNewIpRule({ ipAddress: '', type: 'allow', description: '' });
    
    toast({
      title: "IP Rule Added",
      description: "New IP access rule has been created."
    });
  };

  const toggleAccessRule = (ruleId: string) => {
    setAccessRules(accessRules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    
    toast({
      title: "Rule Updated",
      description: "Access rule status has been changed."
    });
  };

  const toggleIpRule = (ruleId: string) => {
    setIpRules(ipRules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    
    toast({
      title: "IP Rule Updated",
      description: "IP rule status has been changed."
    });
  };

  const handleSettingsSave = () => {
    toast({
      title: "Settings Saved",
      description: "Access control settings have been updated."
    });
  };

  return (
    <div className="space-y-6">
      {/* Access Control Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Access Control Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Multi-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require MFA for all users</p>
              </div>
              <Switch
                checked={settings.requireMFA}
                onCheckedChange={(checked) => setSettings({ ...settings, requireMFA: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>IP Whitelist</Label>
                <p className="text-sm text-muted-foreground">Only allow access from approved IPs</p>
              </div>
              <Switch
                checked={settings.ipWhitelistEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, ipWhitelistEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Geo-blocking</Label>
                <p className="text-sm text-muted-foreground">Block access from certain countries</p>
              </div>
              <Switch
                checked={settings.geoBlocking}
                onCheckedChange={(checked) => setSettings({ ...settings, geoBlocking: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                className="w-32"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                className="w-32"
              />
            </div>
          </div>
          
          <Button onClick={handleSettingsSave}>
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Access Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Access Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Rule name"
              value={newAccessRule.name}
              onChange={(e) => setNewAccessRule({ ...newAccessRule, name: e.target.value })}
            />
            <Input
              placeholder="Resource path"
              value={newAccessRule.resource}
              onChange={(e) => setNewAccessRule({ ...newAccessRule, resource: e.target.value })}
            />
            <Input
              placeholder="Actions (read,write)"
              value={newAccessRule.action}
              onChange={(e) => setNewAccessRule({ ...newAccessRule, action: e.target.value })}
            />
            <Button onClick={handleAddAccessRule}>
              Add Rule
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.resource}</TableCell>
                  <TableCell>{rule.action}</TableCell>
                  <TableCell>{rule.condition}</TableCell>
                  <TableCell>
                    {rule.enabled ? (
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleAccessRule(rule.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* IP Access Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>IP Access Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="IP address/CIDR"
              value={newIpRule.ipAddress}
              onChange={(e) => setNewIpRule({ ...newIpRule, ipAddress: e.target.value })}
            />
            <Select value={newIpRule.type} onValueChange={(value: 'allow' | 'deny') => setNewIpRule({ ...newIpRule, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allow">Allow</SelectItem>
                <SelectItem value="deny">Deny</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Description"
              value={newIpRule.description}
              onChange={(e) => setNewIpRule({ ...newIpRule, description: e.target.value })}
            />
            <Button onClick={handleAddIpRule}>
              Add IP Rule
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ipRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.ipAddress}</TableCell>
                  <TableCell>
                    {rule.type === 'allow' ? (
                      <Badge className="bg-green-100 text-green-800">Allow</Badge>
                    ) : (
                      <Badge variant="destructive">Deny</Badge>
                    )}
                  </TableCell>
                  <TableCell>{rule.description}</TableCell>
                  <TableCell>
                    {rule.enabled ? (
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleIpRule(rule.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
