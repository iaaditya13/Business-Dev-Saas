
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Users, 
  Lock, 
  Eye,
  RefreshCw
} from 'lucide-react';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

interface SecurityMetric {
  label: string;
  value: number;
  total: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export const SecurityMonitoring = () => {
  const [alerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Multiple Failed Login Attempts',
      description: 'User account locked due to 5 consecutive failed login attempts from IP 203.0.113.45',
      timestamp: '2024-06-15 10:45:00',
      resolved: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Unusual Access Pattern',
      description: 'User logged in from a new location: San Francisco, CA',
      timestamp: '2024-06-15 09:30:00',
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Password Policy Updated',
      description: 'Minimum password length increased to 12 characters',
      timestamp: '2024-06-15 08:15:00',
      resolved: true
    }
  ]);

  const [metrics] = useState<SecurityMetric[]>([
    {
      label: 'Users with MFA Enabled',
      value: 18,
      total: 22,
      status: 'warning',
      trend: 'up'
    },
    {
      label: 'Active Sessions',
      value: 15,
      total: 50,
      status: 'good',
      trend: 'stable'
    },
    {
      label: 'Security Policies Compliant',
      value: 9,
      total: 10,
      status: 'good',
      trend: 'up'
    },
    {
      label: 'Failed Login Attempts (24h)',
      value: 12,
      total: 100,
      status: 'warning',
      trend: 'up'
    }
  ]);

  const [activeSessions] = useState([
    {
      id: '1',
      user: 'john.doe@company.com',
      location: 'New York, US',
      device: 'Chrome on Windows',
      lastActivity: '2 minutes ago',
      risk: 'low'
    },
    {
      id: '2',
      user: 'jane.smith@company.com',
      location: 'London, UK',
      device: 'Safari on Mac',
      lastActivity: '15 minutes ago',
      risk: 'medium'
    },
    {
      id: '3',
      user: 'bob.johnson@company.com',
      location: 'Unknown',
      device: 'Firefox on Linux',
      lastActivity: '1 hour ago',
      risk: 'high'
    }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">{metric.label}</p>
                <TrendingUp className={`h-4 w-4 ${metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {metric.value}/{metric.total}
                </div>
                <Progress 
                  value={(metric.value / metric.total) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round((metric.value / metric.total) * 100)}% complete
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Security Alerts</span>
            </CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.filter(alert => !alert.resolved).map((alert) => (
            <Alert key={alert.id} variant={getAlertVariant(alert.type) as any}>
              <div className="flex items-start space-x-2">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <AlertTitle className="flex items-center justify-between">
                    {alert.title}
                    <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  </AlertTitle>
                  <AlertDescription className="mt-1">
                    {alert.description}
                  </AlertDescription>
                  <div className="mt-2 flex space-x-2">
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                    <Button variant="outline" size="sm">
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              </div>
            </Alert>
          ))}
          
          {alerts.filter(alert => !alert.resolved).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No active security alerts</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Active Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.user}</TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{session.device}</TableCell>
                  <TableCell>{session.lastActivity}</TableCell>
                  <TableCell>{getRiskBadge(session.risk)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Lock className="h-4 w-4" />
                      </Button>
                    </div>
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
