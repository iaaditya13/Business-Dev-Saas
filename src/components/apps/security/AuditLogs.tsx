
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, Download, Search, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  outcome: 'success' | 'failure' | 'warning';
  ipAddress: string;
  details: string;
}

export const AuditLogs = () => {
  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-06-15 10:30:45',
      user: 'john.doe@company.com',
      action: 'LOGIN',
      resource: '/auth/login',
      outcome: 'success',
      ipAddress: '192.168.1.100',
      details: 'Successful login'
    },
    {
      id: '2',
      timestamp: '2024-06-15 10:25:12',
      user: 'jane.smith@company.com',
      action: 'UPDATE_USER',
      resource: '/users/123',
      outcome: 'success',
      ipAddress: '192.168.1.101',
      details: 'Updated user profile'
    },
    {
      id: '3',
      timestamp: '2024-06-15 10:20:33',
      user: 'unknown',
      action: 'LOGIN_ATTEMPT',
      resource: '/auth/login',
      outcome: 'failure',
      ipAddress: '203.0.113.45',
      details: 'Failed login attempt - invalid credentials'
    },
    {
      id: '4',
      timestamp: '2024-06-15 10:15:21',
      user: 'bob.johnson@company.com',
      action: 'ACCESS_DENIED',
      resource: '/admin/settings',
      outcome: 'warning',
      ipAddress: '192.168.1.102',
      details: 'Attempted to access restricted resource'
    },
    {
      id: '5',
      timestamp: '2024-06-15 10:10:08',
      user: 'admin@company.com',
      action: 'DELETE_USER',
      resource: '/users/456',
      outcome: 'success',
      ipAddress: '192.168.1.10',
      details: 'Deleted user account'
    }
  ]);

  const [filters, setFilters] = useState({
    user: '',
    action: '',
    outcome: '',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined
  });

  const [showDateFromPicker, setShowDateFromPicker] = useState(false);
  const [showDateToPicker, setShowDateToPicker] = useState(false);

  const filteredLogs = logs.filter(log => {
    if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) {
      return false;
    }
    if (filters.action && !log.action.toLowerCase().includes(filters.action.toLowerCase())) {
      return false;
    }
    if (filters.outcome && log.outcome !== filters.outcome) {
      return false;
    }
    // Add date filtering logic here if needed
    return true;
  });

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'failure':
        return <Badge variant="destructive">Failure</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return <Badge variant="outline">{outcome}</Badge>;
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Outcome', 'IP Address', 'Details'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.resource,
        log.outcome,
        log.ipAddress,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Audit Logs</span>
            </CardTitle>
            <Button onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="userFilter">User</Label>
              <Input
                id="userFilter"
                placeholder="Filter by user"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actionFilter">Action</Label>
              <Input
                id="actionFilter"
                placeholder="Filter by action"
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outcomeFilter">Outcome</Label>
              <Select value={filters.outcome} onValueChange={(value) => setFilters({ ...filters, outcome: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All outcomes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All outcomes</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date From</Label>
              <Popover open={showDateFromPicker} onOpenChange={setShowDateFromPicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => {
                      setFilters({ ...filters, dateFrom: date });
                      setShowDateFromPicker(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Date To</Label>
              <Popover open={showDateToPicker} onOpenChange={setShowDateToPicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => {
                      setFilters({ ...filters, dateTo: date });
                      setShowDateToPicker(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Logs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.resource}</TableCell>
                    <TableCell>{getOutcomeBadge(log.outcome)}</TableCell>
                    <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
