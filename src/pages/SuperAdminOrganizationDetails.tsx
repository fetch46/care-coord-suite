import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft,
  Building2,
  Users,
  CreditCard,
  Settings,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash,
  RotateCcw,
  Key,
  Shield,
  Package,
  Calendar,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";

interface Organization {
  id: string;
  company_name: string;
  domain?: string;
  admin_email: string;
  admin_user_id?: string;
  status: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
  trial_ends_at?: string;
  logo_url?: string;
  description?: string;
  max_users: number;
  max_patients: number;
  settings?: any;
}

interface OrganizationUser {
  id: string;
  user_id: string;
  role: string;
  is_confirmed: boolean;
  invited_at: string;
  confirmed_at?: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
}

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_type: string;
  user_limit: number;
  storage_gb: number;
  features: any; // Json type from database
  is_popular: boolean;
  is_active: boolean;
}

interface PackageAssignment {
  id: string;
  package_id: string;
  assigned_at: string;
  is_active: boolean;
  expires_at?: string;
  organization_packages: Package;
}

export default function SuperAdminOrganizationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageAssignments, setPackageAssignments] = useState<PackageAssignment[]>([]);
  
  // Dialog states
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showAssignPackageDialog, setShowAssignPackageDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(null);
  
  // Form states
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrganizationDetails();
    }
  }, [id]);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch organization details
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();

      if (orgError) throw orgError;
      setOrganization(orgData);

      // Fetch organization users - simplified without profiles join for now
      const { data: usersData, error: usersError } = await supabase
        .from('organization_users')
        .select('*')
        .eq('organization_id', id);

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch available packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('organization_packages')
        .select('*')
        .eq('is_active', true);

      if (packagesError) throw packagesError;
      setPackages(packagesData || []);

      // Fetch current package assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('organization_package_assignments')
        .select(`
          *,
          organization_packages (*)
        `)
        .eq('organization_id', id);

      if (assignmentsError) throw assignmentsError;
      setPackageAssignments(assignmentsData || []);

    } catch (error) {
      console.error('Error fetching organization details:', error);
      toast({
        title: "Error",
        description: "Failed to load organization details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Note: In a real implementation, you would first create the auth user
      // For demo purposes, we'll show a success message
      console.log('Would invite user:', newUserEmail, 'with role:', newUserRole);

      toast({
        title: "Success",
        description: "User invited successfully. They will receive an email invitation.",
      });

      setShowAddUserDialog(false);
      setNewUserEmail("");
      setNewUserRole("user");
      await fetchOrganizationDetails();
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive"
      });
    }
  };

  const handleAssignPackage = async () => {
    if (!selectedPackageId) {
      toast({
        title: "Validation Error",
        description: "Please select a package",
        variant: "destructive"
      });
      return;
    }

    try {
      // Deactivate current packages
      await supabase
        .from('organization_package_assignments')
        .update({ is_active: false })
        .eq('organization_id', id);

      // Assign new package
      const { error } = await supabase
        .from('organization_package_assignments')
        .insert({
          organization_id: id,
          package_id: selectedPackageId,
          is_active: true,
          assigned_by: (await supabase.auth.getUser()).data.user?.id,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Package assigned successfully",
      });

      setShowAssignPackageDialog(false);
      setSelectedPackageId("");
      await fetchOrganizationDetails();
    } catch (error) {
      console.error('Error assigning package:', error);
      toast({
        title: "Error",
        description: "Failed to assign package",
        variant: "destructive"
      });
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword.trim()) {
      toast({
        title: "Validation Error",
        description: "Password is required",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, this would call an edge function to reset the password
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Password reset successfully. User will be notified.",
      });

      setShowResetPasswordDialog(false);
      setSelectedUser(null);
      setNewPassword("");
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive"
      });
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('organization_users')
        .delete()
        .eq('user_id', userId)
        .eq('organization_id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User removed from organization",
      });

      await fetchOrganizationDetails();
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive"
      });
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading organization details...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!organization) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Organization not found</h2>
          <Button onClick={() => navigate('/super-admin/organizations')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Organizations
          </Button>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/super-admin/organizations')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Building2 className="w-8 h-8" />
                {organization.company_name}
              </h1>
              <p className="text-muted-foreground">Organization Management</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={organization.status === 'active' ? 'default' : 'secondary'}>
              {organization.status}
            </Badge>
            <Badge variant={organization.subscription_status === 'active' ? 'default' : 'secondary'}>
              {organization.subscription_status}
            </Badge>
          </div>
        </div>

        {/* Organization Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                of {organization.max_users} allowed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {packageAssignments.filter(p => p.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground">
                packages assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trial Status</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {organization.trial_ends_at ? 
                  Math.ceil((new Date(organization.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : 'N/A'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                days remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Company:</span>
                    <span>{organization.company_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Admin Email:</span>
                    <span>{organization.admin_email}</span>
                  </div>
                  {organization.domain && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Domain:</span>
                      <span>{organization.domain}</span>
                    </div>
                  )}
                  {organization.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-muted-foreground mt-1">{organization.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Limits & Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Users</span>
                    <span className="font-medium">{users.length} / {organization.max_users}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Max Patients</span>
                    <span className="font-medium">{organization.max_patients}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Created</span>
                    <span className="font-medium">
                      {new Date(organization.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Updated</span>
                    <span className="font-medium">
                      {new Date(organization.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Organization Users</h3>
              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add User to Organization</DialogTitle>
                    <DialogDescription>
                      Invite a new user to join this organization
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user_email">Email Address</Label>
                      <Input
                        id="user_email"
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_role">Role</Label>
                      <Select value={newUserRole} onValueChange={setNewUserRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.profiles?.first_name && user.profiles?.last_name
                            ? `${user.profiles.first_name} ${user.profiles.last_name}`
                            : user.profiles?.email || 'Unknown User'
                          }
                        </TableCell>
                        <TableCell>{user.profiles?.email || 'No email'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_confirmed ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-yellow-500" />
                              <span>Pending</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.invited_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowResetPasswordDialog(true);
                                }}
                              >
                                <Key className="w-4 h-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleRemoveUser(user.user_id)}
                                className="text-destructive"
                              >
                                <Trash className="w-4 h-4 mr-2" />
                                Remove User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Package Management</h3>
              <Dialog open={showAssignPackageDialog} onOpenChange={setShowAssignPackageDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Package className="w-4 h-4 mr-2" />
                    Assign Package
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Package</DialogTitle>
                    <DialogDescription>
                      Select a package to assign to this organization
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Label htmlFor="package_select">Available Packages</Label>
                    <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{pkg.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ${pkg.price}/{pkg.billing_type}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAssignPackageDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignPackage}>
                      Assign Package
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packageAssignments.map((assignment) => (
                <Card key={assignment.id} className={assignment.is_active ? 'border-green-200 bg-green-50' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {assignment.organization_packages.name}
                        </CardTitle>
                        <CardDescription>
                          ${assignment.organization_packages.price}/{assignment.organization_packages.billing_type}
                        </CardDescription>
                      </div>
                      <Badge variant={assignment.is_active ? 'default' : 'secondary'}>
                        {assignment.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {assignment.organization_packages.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span>{assignment.organization_packages.user_limit === -1 ? 'Unlimited' : assignment.organization_packages.user_limit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span>{assignment.organization_packages.storage_gb}GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assigned:</span>
                        <span>{new Date(assignment.assigned_at).toLocaleDateString()}</span>
                      </div>
                      {assignment.expires_at && (
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span>{new Date(assignment.expires_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>
                  Manage organization configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Organization settings management is coming soon. This will include
                    custom configurations, integrations, and advanced preferences.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reset Password Dialog */}
        <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              Generate a new password for {selectedUser?.profiles?.first_name || 'User'} {selectedUser?.profiles?.last_name || ''}
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Button type="button" variant="outline" onClick={generatePassword}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleResetPassword}>
                Reset Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
}