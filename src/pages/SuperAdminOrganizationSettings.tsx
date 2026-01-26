import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminPackageAssignment } from "@/components/SuperAdminPackageAssignment";
import { 
  Building2, 
  Package,
  Users, 
  Settings2,
  ArrowLeft,
  Save,
  Shield
} from "lucide-react";

interface Organization {
  id: string;
  company_name: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
  subscription_status?: string;
  created_at: string;
  trial_ends_at?: string;
  logo_url?: string;
  description?: string;
  user_limit?: number;
  storage_limit_gb?: number;
  settings?: any;
  admin_email?: string;
  domain?: string;
  max_users?: number;
  max_patients?: number;
  status?: string;
}

interface PackageAssignment {
  id: string;
  package_id: string;
  is_active: boolean;
  expires_at?: string;
  organization_packages: {
    name: string;
    description: string;
    price: number;
    billing_type: string;
    user_limit: number;
    storage_gb: number;
    features: string[];
  };
}

export default function SuperAdminOrganizationSettings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [packageAssignments, setPackageAssignments] = useState<PackageAssignment[]>([]);
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrganizationDetails();
      fetchPackageAssignments();
    }
  }, [id]);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setOrganization(data);
    } catch (error) {
      console.error("Error fetching organization:", error);
      toast({
        title: "Error",
        description: "Failed to load organization details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from("organization_package_assignments")
        .select(`
          *,
          organization_packages (
            name,
            description,
            price,
            billing_type,
            user_limit,
            storage_gb,
            features
          )
        `)
        .eq("organization_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const transformedData = (data || []).map(assignment => ({
        ...assignment,
        organization_packages: {
          ...assignment.organization_packages,
          features: Array.isArray(assignment.organization_packages.features) 
            ? assignment.organization_packages.features.filter((f): f is string => typeof f === 'string')
            : []
        }
      }));
      
      setPackageAssignments(transformedData);
    } catch (error) {
      console.error("Error fetching package assignments:", error);
      toast({
        title: "Error",
        description: "Failed to load package assignments",
        variant: "destructive"
      });
    }
  };

  const saveOrganizationSettings = async () => {
    if (!organization) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("organizations")
        .update({
          company_name: organization.company_name,
          admin_email: organization.admin_email,
          domain: organization.domain,
          description: organization.description,
          max_users: organization.max_users,
          max_patients: organization.max_patients,
          status: organization.status,
          subscription_status: organization.subscription_status,
          logo_url: organization.logo_url,
          settings: organization.settings,
          updated_at: new Date().toISOString()
        })
        .eq("id", organization.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organization settings saved successfully"
      });
    } catch (error) {
      console.error("Error saving organization settings:", error);
      toast({
        title: "Error",
        description: "Failed to save organization settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const deactivatePackageAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from("organization_package_assignments")
        .update({ is_active: false })
        .eq("id", assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Package assignment deactivated"
      });

      fetchPackageAssignments();
    } catch (error) {
      console.error("Error deactivating package assignment:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate package assignment",
        variant: "destructive"
      });
    }
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
    }).format(amount);
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading organization settings...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!organization) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground">Organization not found</p>
            <Button onClick={() => navigate("/super-admin/organizations")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organizations
            </Button>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  const activePackage = packageAssignments.find(pa => pa.is_active);

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/super-admin/organizations")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{organization.company_name} Settings</h1>
              <p className="text-muted-foreground">
                Manage organization configuration and packages
              </p>
            </div>
          </div>
          <Button onClick={saveOrganizationSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Packages
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  Basic information about the organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={organization.company_name}
                      onChange={(e) => setOrganization(prev => prev ? {...prev, company_name: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_email">Admin Email</Label>
                    <Input
                      id="admin_email"
                      type="email"
                      value={organization.admin_email || ''}
                      onChange={(e) => setOrganization(prev => prev ? {...prev, admin_email: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      value={organization.domain || ""}
                      onChange={(e) => setOrganization(prev => prev ? {...prev, domain: e.target.value} : null)}
                      placeholder="organization.example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      value={organization.logo_url || ""}
                      onChange={(e) => setOrganization(prev => prev ? {...prev, logo_url: e.target.value} : null)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={organization.description || ""}
                    onChange={(e) => setOrganization(prev => prev ? {...prev, description: e.target.value} : null)}
                    placeholder="Brief description of the organization"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limits & Status</CardTitle>
                <CardDescription>
                  Organization limits and current status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="max_users">Max Users</Label>
                    <Input
                      id="max_users"
                      type="number"
                      value={organization.max_users || 10}
                      onChange={(e) => setOrganization(prev => prev ? {...prev, max_users: parseInt(e.target.value) || 10} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_patients">Max Patients</Label>
                    <Input
                      id="max_patients"
                      type="number"
                      value={organization.max_patients || 100}
                      onChange={(e) => setOrganization(prev => prev ? {...prev, max_patients: parseInt(e.target.value) || 100} : null)}
                    />
                  </div>
                  <div>
                    <Label>Current Status</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusBadgeVariant(organization.subscription_status || 'trial')}>
                        {organization.subscription_status || 'trial'}
                      </Badge>
                      <Badge variant="outline">
                        {organization.status || 'active'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Package Management */}
          <TabsContent value="packages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Package Assignments</CardTitle>
                    <CardDescription>
                      Manage subscription packages for this organization
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsPackageDialogOpen(true)}>
                    <Package className="w-4 h-4 mr-2" />
                    Assign New Package
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {packageAssignments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No packages assigned to this organization</p>
                    <Button 
                      onClick={() => setIsPackageDialogOpen(true)}
                      className="mt-4"
                      variant="outline"
                    >
                      Assign First Package
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {packageAssignments.map((assignment) => (
                      <Card key={assignment.id} className={`${assignment.is_active ? 'ring-2 ring-primary' : 'opacity-60'}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{assignment.organization_packages.name}</h3>
                                <Badge variant={assignment.is_active ? 'default' : 'secondary'}>
                                  {assignment.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {assignment.organization_packages.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="font-medium">
                                  {formatCurrency(assignment.organization_packages.price)}/{assignment.organization_packages.billing_type}
                                </span>
                                <span>
                                  {assignment.organization_packages.user_limit === -1 ? 'Unlimited' : assignment.organization_packages.user_limit} Users
                                </span>
                                <span>
                                  {assignment.organization_packages.storage_gb} GB Storage
                                </span>
                              </div>
                              {assignment.expires_at && (
                                <p className="text-xs text-muted-foreground">
                                  Expires: {new Date(assignment.expires_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {assignment.is_active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deactivatePackageAssignment(assignment.id)}
                              >
                                Deactivate
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all organization users
                    </p>
                  </div>
                  <Switch
                    checked={organization.settings?.require_2fa || false}
                    onCheckedChange={(checked) => 
                      setOrganization(prev => prev ? {
                        ...prev, 
                        settings: { ...prev.settings, require_2fa: checked }
                      } : null)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users
                    </p>
                  </div>
                  <Switch
                    checked={organization.settings?.session_timeout_enabled || false}
                    onCheckedChange={(checked) => 
                      setOrganization(prev => prev ? {
                        ...prev, 
                        settings: { ...prev.settings, session_timeout_enabled: checked }
                      } : null)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">IP Restrictions</Label>
                    <p className="text-sm text-muted-foreground">
                      Limit access to specific IP addresses
                    </p>
                  </div>
                  <Switch
                    checked={organization.settings?.ip_restrictions_enabled || false}
                    onCheckedChange={(checked) => 
                      setOrganization(prev => prev ? {
                        ...prev, 
                        settings: { ...prev.settings, ip_restrictions_enabled: checked }
                      } : null)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Package Assignment Dialog */}
        <SuperAdminPackageAssignment
          organizationId={organization.id}
          organizationName={organization.company_name}
          isOpen={isPackageDialogOpen}
          onClose={() => setIsPackageDialogOpen(false)}
          onSuccess={() => {
            fetchPackageAssignments();
            fetchOrganizationDetails();
          }}
          currentPackageId={activePackage?.package_id}
        />
      </div>
    </SuperAdminLayout>
  );
}