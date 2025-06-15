
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export const RoleManagement = () => {
  const { toast } = useToast();
  
  const [permissions] = useState<Permission[]>([
    { id: '1', name: 'user.read', description: 'View users', category: 'User Management' },
    { id: '2', name: 'user.write', description: 'Create/Edit users', category: 'User Management' },
    { id: '3', name: 'user.delete', description: 'Delete users', category: 'User Management' },
    { id: '4', name: 'finance.read', description: 'View financial data', category: 'Finance' },
    { id: '5', name: 'finance.write', description: 'Edit financial data', category: 'Finance' },
    { id: '6', name: 'inventory.read', description: 'View inventory', category: 'Inventory' },
    { id: '7', name: 'inventory.write', description: 'Manage inventory', category: 'Inventory' },
    { id: '8', name: 'reports.read', description: 'View reports', category: 'Reports' },
    { id: '9', name: 'settings.write', description: 'Modify settings', category: 'System' }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access',
      permissions: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      userCount: 2
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Management level access',
      permissions: ['1', '4', '5', '6', '7', '8'],
      userCount: 5
    },
    {
      id: '3',
      name: 'User',
      description: 'Standard user access',
      permissions: ['1', '4', '6', '8'],
      userCount: 15
    }
  ]);

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  const handleAddRole = () => {
    if (!newRole.name || !newRole.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0
    };

    setRoles([...roles, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsAddRoleOpen(false);
    
    toast({
      title: "Role Created",
      description: `${role.name} role has been created successfully.`
    });
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role && role.userCount > 0) {
      toast({
        title: "Cannot Delete Role",
        description: `This role is assigned to ${role.userCount} users. Please reassign users first.`,
        variant: "destructive"
      });
      return;
    }

    setRoles(roles.filter(r => r.id !== roleId));
    toast({
      title: "Role Deleted",
      description: "Role has been removed successfully."
    });
  };

  const togglePermission = (permissionId: string) => {
    if (newRole.permissions.includes(permissionId)) {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter(p => p !== permissionId)
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permissionId]
      });
    }
  };

  const getPermissionsByCategory = () => {
    const grouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
    return grouped;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Role Management</span>
            </CardTitle>
            <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleDescription">Description</Label>
                    <Textarea
                      id="roleDescription"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Enter role description"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label>Permissions</Label>
                    {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-sm">{category}</h4>
                        <div className="space-y-2 pl-4">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={newRole.permissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                              <Label htmlFor={permission.id} className="text-sm">
                                {permission.name} - {permission.description}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleAddRole} className="w-full">
                    Create Role
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Permissions ({role.permissions.length})</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {role.permissions.slice(0, 3).map((permId) => {
                          const permission = permissions.find(p => p.id === permId);
                          return permission ? (
                            <Badge key={permission.id} variant="secondary" className="text-xs">
                              {permission.name}
                            </Badge>
                          ) : null;
                        })}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
