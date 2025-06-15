
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Key, Smartphone, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SecuritySettings = () => {
  const { toast } = useToast();
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginNotifications: true,
    passwordExpiry: false,
    ipWhitelist: false
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSecuritySave = () => {
    console.log('Saving security settings:', security);
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been saved."
    });
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }

    if (passwords.new.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    console.log('Changing password');
    setPasswords({ current: '', new: '', confirm: '' });
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully."
    });
  };

  const activeSessions = [
    { id: 1, device: 'Chrome on Windows', location: 'New York, US', lastActive: '2 minutes ago', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'New York, US', lastActive: '1 hour ago', current: false },
    { id: 3, device: 'Firefox on Mac', location: 'San Francisco, US', lastActive: '2 days ago', current: false }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>

          <Button onClick={handlePasswordChange}>
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch
              checked={security.twoFactorAuth}
              onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Login Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <Switch
              checked={security.loginNotifications}
              onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Password Expiry</Label>
              <p className="text-sm text-muted-foreground">Require password changes every 90 days</p>
            </div>
            <Switch
              checked={security.passwordExpiry}
              onCheckedChange={(checked) => setSecurity({ ...security, passwordExpiry: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>IP Whitelist</Label>
              <p className="text-sm text-muted-foreground">Only allow access from specific IP addresses</p>
            </div>
            <Switch
              checked={security.ipWhitelist}
              onCheckedChange={(checked) => setSecurity({ ...security, ipWhitelist: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
              className="w-32"
            />
          </div>

          <Button onClick={handleSecuritySave}>
            Save Security Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Active Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{session.device}</p>
                    {session.current && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                  <p className="text-xs text-muted-foreground">Last active: {session.lastActive}</p>
                </div>
                {!session.current && (
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
