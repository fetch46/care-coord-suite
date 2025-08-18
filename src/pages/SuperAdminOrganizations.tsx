import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMasquerade } from "@/hooks/useMasquerade";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  MoreHorizontal,
  Search,
  Eye,
  LogIn,
  LogOut,
  CreditCard,
  Plus,
  Filter,
  AlertTriangle,
  Edit,
  Trash,
  Check,
  Settings
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
  trial_ends_at?: string;
  logo_url?: string;
  description?: string;
  max_users: number;
  max_patients: number;
  subscriptions?: {
    id: string;
    status: string;
    amount: number;
    subscription_plans: {
      name: string;
    };
  }[];
}

interface NewOrganization {
  company_name: string;
  admin_email: string;
  domain: string;
  description: string;
  max_users: number;
  max_patients: number;
}

export default function SuperAdminOrganizations() {
  const { toast } = useToast();
  const { currentMasquerade, isMasquerading, startMasquerade, endMasquerade, loading: masqueradeLoading } = useMasquerade();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [newOrganization, setNewOrganization] = useState<NewOrganization>({
    company_name: "",
    admin_email: "",
    domain: "",
    description: "",
    max_users: 10,
    max_patients: 100
  });

  useEffect(() => {
    fetchOrganizations();
    
    // Set up polling to check for new organizations every 30 seconds
    const interval = setInterval(fetchOrganizations, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOrganizations();
  }, [organizations, searchTerm, statusFilter]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organizations")
        .select(`
          *,
          subscriptions (
            id,
            status,
            amount,
            subscription_plans (
              name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrganizations = () => {
    let filtered = organizations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.admin_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.domain?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(org => org.subscription_status === statusFilter);
    }

    setFilteredOrganizations(filtered);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'secondary';
      case 'expired':
      case 'canceled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const handleAddOrganization = async () => {
    if (!newOrganization.company_name.trim() || !newOrganization.admin_email.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name and admin email are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .insert([{
          ...newOrganization,
          status: 'active',
          subscription_status: 'trial'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organization created successfully",
      });

      setNewOrganization({
        company_name: "",
        admin_email: "",
        domain: "",
        description: "",
        max_users: 10,
        max_patients: 100
      });
      setIsAddDialogOpen(false);
      await fetchOrganizations();
    } catch (error) {
      console.error('Error adding organization:', error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditOrganization = async () => {
    if (!selectedOrganization) return;

    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          company_name: selectedOrganization.company_name,
          admin_email: selectedOrganization.admin_email,
          domain: selectedOrganization.domain,
          description: selectedOrganization.description,
          max_users: selectedOrganization.max_users,
          max_patients: selectedOrganization.max_patients
        })
        .eq('id', selectedOrganization.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organization updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedOrganization(null);
      await fetchOrganizations();
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrganization = async (organizationId: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', organizationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });

      await fetchOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    }
  };

  const handleConfirmOrganization = async (organizationId: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ 
          status: 'active',
          subscription_status: 'active'
        })
        .eq('id', organizationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organization confirmed and activated",
      });

      await fetchOrganizations();
    } catch (error) {
      console.error('Error confirming organization:', error);
      toast({
        title: "Error",
        description: "Failed to confirm organization",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (organizationId: string) => {
    toast({
      title: "View Details",
      description: "Organization details modal would open here"
    });
  };

  const handleViewSubscription = (organizationId: string) => {
    toast({
      title: "View Subscription",
      description: "Subscription details modal would open here"
    });
  };

  const handleMasquerade = async (organizationId: string, adminUserId: string) => {
    const success = await startMasquerade(adminUserId, organizationId);
    if (success) {
      toast({
        title: "Masquerade Started",
        description: "You are now acting as the organization admin. Use the 'End Masquerade' button to return to super admin view.",
      });
    }
  };

  const handleEndMasquerade = async () => {
    const success = await endMasquerade();
    if (success) {
      toast({
        title: "Masquerade Ended",
        description: "You are now back to your super admin account.",
      });
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading organizations...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Masquerade Alert */}
        {isMasquerading && currentMasquerade && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                You are currently masquerading as an organization admin. All actions will be performed as that user.
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleEndMasquerade}
                disabled={masqueradeLoading}
                className="ml-4"
              >
                <LogOut className="w-4 h-4 mr-2" />
                End Masquerade
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Organizations</h1>
            <p className="text-muted-foreground">
              Manage all organizations and their subscriptions
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={fetchOrganizations}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Organization</DialogTitle>
                  <DialogDescription>
                    Create a new organization with subscription settings
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        value={newOrganization.company_name}
                        onChange={(e) => setNewOrganization(prev => ({ ...prev, company_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin_email">Admin Email *</Label>
                      <Input
                        id="admin_email"
                        type="email"
                        value={newOrganization.admin_email}
                        onChange={(e) => setNewOrganization(prev => ({ ...prev, admin_email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      value={newOrganization.domain}
                      onChange={(e) => setNewOrganization(prev => ({ ...prev, domain: e.target.value }))}
                      placeholder="organization.example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newOrganization.description}
                      onChange={(e) => setNewOrganization(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the organization"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max_users">Max Users</Label>
                      <Input
                        id="max_users"
                        type="number"
                        value={newOrganization.max_users}
                        onChange={(e) => setNewOrganization(prev => ({ ...prev, max_users: parseInt(e.target.value) || 10 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_patients">Max Patients</Label>
                      <Input
                        id="max_patients"
                        type="number"
                        value={newOrganization.max_patients}
                        onChange={(e) => setNewOrganization(prev => ({ ...prev, max_patients: parseInt(e.target.value) || 100 }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddOrganization} disabled={loading}>
                    Create Organization
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("trial")}>
                    Trial
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("expired")}>
                    Expired
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Organizations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Organizations ({filteredOrganizations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Admin Email</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Limits</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No organizations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrganizations.map((organization) => {
                    const activeSubscription = organization.subscriptions?.find(s => s.status === 'active');
                    
                    return (
                      <TableRow key={organization.id}>
                        <TableCell className="font-medium">{organization.company_name}</TableCell>
                        <TableCell>{organization.admin_email}</TableCell>
                        <TableCell>{organization.domain || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(organization.subscription_status)}>
                            {organization.subscription_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {activeSubscription?.subscription_plans?.name || "No Plan"}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{organization.max_users} users</div>
                            <div className="text-muted-foreground">{organization.max_patients} patients</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(organization.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(organization.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedOrganization(organization);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {organization.status !== 'active' && (
                                <DropdownMenuItem onClick={() => handleConfirmOrganization(organization.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Confirm & Activate
                                </DropdownMenuItem>
                              )}
                              {organization.admin_user_id && (
                                <DropdownMenuItem 
                                  onClick={() => handleMasquerade(organization.id, organization.admin_user_id!)}
                                  disabled={isMasquerading}
                                >
                                  <LogIn className="mr-2 h-4 w-4" />
                                  Masquerade as Admin
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleViewSubscription(organization.id)}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                View Subscription
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewSubscription(organization.id)}>
                                <Settings className="mr-2 h-4 w-4" />
                                Manage Packages
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteOrganization(organization.id)}
                                className="text-destructive"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Organization Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
              <DialogDescription>
                Update organization details and settings
              </DialogDescription>
            </DialogHeader>
            {selectedOrganization && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_company_name">Company Name *</Label>
                    <Input
                      id="edit_company_name"
                      value={selectedOrganization.company_name}
                      onChange={(e) => setSelectedOrganization(prev => prev ? ({ ...prev, company_name: e.target.value }) : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_admin_email">Admin Email *</Label>
                    <Input
                      id="edit_admin_email"
                      type="email"
                      value={selectedOrganization.admin_email}
                      onChange={(e) => setSelectedOrganization(prev => prev ? ({ ...prev, admin_email: e.target.value }) : null)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_domain">Domain</Label>
                  <Input
                    id="edit_domain"
                    value={selectedOrganization.domain || ""}
                    onChange={(e) => setSelectedOrganization(prev => prev ? ({ ...prev, domain: e.target.value }) : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_description">Description</Label>
                  <Textarea
                    id="edit_description"
                    value={selectedOrganization.description || ""}
                    onChange={(e) => setSelectedOrganization(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_max_users">Max Users</Label>
                    <Input
                      id="edit_max_users"
                      type="number"
                      value={selectedOrganization.max_users}
                      onChange={(e) => setSelectedOrganization(prev => prev ? ({ ...prev, max_users: parseInt(e.target.value) || 10 }) : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_max_patients">Max Patients</Label>
                    <Input
                      id="edit_max_patients"
                      type="number"
                      value={selectedOrganization.max_patients}
                      onChange={(e) => setSelectedOrganization(prev => prev ? ({ ...prev, max_patients: parseInt(e.target.value) || 100 }) : null)}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditOrganization}>
                Update Organization
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
}