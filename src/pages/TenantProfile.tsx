import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  FileText, 
  CreditCard,
  MapPin,
  Save,
  Edit,
  Calendar
} from "lucide-react";

interface TenantProfile {
  id: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  website_url?: string;
  license_number?: string;
  tax_id?: string;
  billing_address?: string;
  billing_contact_name?: string;
  billing_contact_email?: string;
  billing_contact_phone?: string;
  settings?: Record<string, unknown>;
  tenant?: {
    company_name: string;
    admin_email: string;
    status: string;
    subscription_status: string;
    created_at: string;
  };
}

export default function TenantProfile() {
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchTenantProfile();
  }, []);

  const fetchTenantProfile = async () => {
    try {
      setLoading(true);
      
      // First get the tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('admin_user_id', user?.id)
        .single();

      if (tenantError) {
        console.error('Error fetching tenant:', tenantError);
        return;
      }

      // Then get or create the profile
      let { data: profileData, error: profileError } = await supabase
        .from('tenant_profiles')
        .select('*, tenant:tenants(*)')
        .eq('tenant_id', tenantData.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from('tenant_profiles')
          .insert({ tenant_id: tenantData.id })
          .select('*, tenant:tenants(*)')
          .single();

        if (createError) {
          throw createError;
        }
        profileData = newProfile;
        profileError = null; // Clear the error since we created the profile
      } else if (profileError) {
        throw profileError;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching tenant profile:', error);
      toast({
        title: "Error",
        description: "Failed to load tenant profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('tenant_profiles')
        .update({
          business_address: profile.business_address,
          business_phone: profile.business_phone,
          business_email: profile.business_email,
          website_url: profile.website_url,
          license_number: profile.license_number,
          tax_id: profile.tax_id,
          billing_address: profile.billing_address,
          billing_contact_name: profile.billing_contact_name,
          billing_contact_email: profile.billing_contact_email,
          billing_contact_phone: profile.billing_contact_phone,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tenant profile updated successfully"
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating tenant profile:', error);
      toast({
        title: "Error",
        description: "Failed to update tenant profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading tenant profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tenant Profile Not Found</h1>
          <p>Unable to load tenant profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Profile</h1>
          <p className="text-muted-foreground">
            Manage your organization's profile and settings
          </p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button variant="outline" onClick={() => setEditMode(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Company Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Company Name</Label>
            <p className="text-lg font-semibold">{profile.tenant?.company_name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Admin Email</Label>
            <p className="text-sm text-muted-foreground">{profile.tenant?.admin_email}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Badge variant={profile.tenant?.status === 'active' ? 'default' : 'secondary'}>
              {profile.tenant?.status}
            </Badge>
          </div>
          <div>
            <Label className="text-sm font-medium">Subscription</Label>
            <Badge variant={profile.tenant?.subscription_status === 'active' ? 'default' : 'outline'}>
              {profile.tenant?.subscription_status}
            </Badge>
          </div>
          <div>
            <Label className="text-sm font-medium">Member Since</Label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <p className="text-sm text-muted-foreground">
                {new Date(profile.tenant?.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList>
          <TabsTrigger value="business">Business Information</TabsTrigger>
          <TabsTrigger value="billing">Billing Information</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>
                Update your organization's business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_phone">Business Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="business_phone"
                      placeholder="(555) 123-4567"
                      value={profile.business_phone || ''}
                      onChange={(e) => handleInputChange('business_phone', e.target.value)}
                      disabled={!editMode}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_email">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="business_email"
                      type="email"
                      placeholder="contact@company.com"
                      value={profile.business_email || ''}
                      onChange={(e) => handleInputChange('business_email', e.target.value)}
                      disabled={!editMode}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="website_url"
                    placeholder="https://www.company.com"
                    value={profile.website_url || ''}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    disabled={!editMode}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_address">Business Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <Textarea
                    id="business_address"
                    placeholder="123 Business St, City, State 12345"
                    value={profile.business_address || ''}
                    onChange={(e) => handleInputChange('business_address', e.target.value)}
                    disabled={!editMode}
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="license_number"
                      placeholder="LIC-123456"
                      value={profile.license_number || ''}
                      onChange={(e) => handleInputChange('license_number', e.target.value)}
                      disabled={!editMode}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="tax_id"
                      placeholder="12-3456789"
                      value={profile.tax_id || ''}
                      onChange={(e) => handleInputChange('tax_id', e.target.value)}
                      disabled={!editMode}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing Information
              </CardTitle>
              <CardDescription>
                Manage billing contacts and address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billing_contact_name">Billing Contact Name</Label>
                  <Input
                    id="billing_contact_name"
                    placeholder="John Doe"
                    value={profile.billing_contact_name || ''}
                    onChange={(e) => handleInputChange('billing_contact_name', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_contact_email">Billing Contact Email</Label>
                  <Input
                    id="billing_contact_email"
                    type="email"
                    placeholder="billing@company.com"
                    value={profile.billing_contact_email || ''}
                    onChange={(e) => handleInputChange('billing_contact_email', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_contact_phone">Billing Contact Phone</Label>
                <Input
                  id="billing_contact_phone"
                  placeholder="(555) 123-4567"
                  value={profile.billing_contact_phone || ''}
                  onChange={(e) => handleInputChange('billing_contact_phone', e.target.value)}
                  disabled={!editMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_address">Billing Address</Label>
                <Textarea
                  id="billing_address"
                  placeholder="123 Billing St, City, State 12345"
                  value={profile.billing_address || ''}
                  onChange={(e) => handleInputChange('billing_address', e.target.value)}
                  disabled={!editMode}
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Configure organization-specific settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Additional settings will be available here in future updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}