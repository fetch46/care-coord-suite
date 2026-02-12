import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Package, Building2, CreditCard } from "lucide-react";

interface Organization {
  id: string;
  company_name: string;
  email?: string;
  admin_email?: string;
  subscription_status?: string;
}

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_type: string;
  user_limit: number;
  storage_gb: number;
  features: string[];
  is_popular: boolean;
}

interface SubscriptionData {
  organization_id: string;
  package_id: string;
  billing_cycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  starts_at: string;
  ends_at: string;
}

export default function SuperAdminCreateSubscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    organization_id: "",
    package_id: "",
    billing_cycle: "monthly",
    amount: 0,
    currency: "USD",
    starts_at: new Date().toISOString().split('T')[0],
    ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchOrganizations();
    fetchPackages();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("id, company_name, email, subscription_status")
        .order("company_name");

      if (error) throw error;
      setOrganizations((data || []) as any);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive"
      });
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("organization_packages")
        .select("*")
        .eq("is_active", true)
        .order("price");

      if (error) throw error;

      const transformedData = (data || []).map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description || "",
        price: pkg.price,
        billing_type: pkg.billing_type,
        user_limit: pkg.user_limit || 0,
        storage_gb: pkg.storage_gb || 0,
        features: Array.isArray(pkg.features) 
          ? pkg.features.filter((f): f is string => typeof f === 'string')
          : [],
        is_popular: pkg.is_popular || false
      }));

      setPackages(transformedData);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive"
      });
    }
  };

  const handlePackageSelect = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setSubscriptionData(prev => ({
        ...prev,
        package_id: packageId,
        amount: selectedPackage.price
      }));
    }
  };

  const handleCreateSubscription = async () => {
    if (!subscriptionData.organization_id || !subscriptionData.package_id) {
      toast({
        title: "Validation Error",
        description: "Please select both organization and package",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Create subscription record
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          organization_id: subscriptionData.organization_id,
          package_id: subscriptionData.package_id,
          billing_cycle: subscriptionData.billing_cycle,
          amount: subscriptionData.amount,
          status: 'active',
          starts_at: subscriptionData.starts_at + 'T00:00:00.000Z',
          ends_at: subscriptionData.ends_at + 'T23:59:59.999Z'
        });

      if (subError) throw subError;

      // Also create package assignment
      const { error: assignmentError } = await supabase
        .from('organization_package_assignments')
        .insert({
          organization_id: subscriptionData.organization_id,
          package_id: subscriptionData.package_id,
          is_active: true,
          expires_at: subscriptionData.ends_at + 'T23:59:59.999Z'
        });

      if (assignmentError) console.error('Package assignment error:', assignmentError);

      // Update organization subscription status
      const { error: orgUpdateError } = await supabase
        .from('organizations')
        .update({ 
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionData.organization_id);

      if (orgUpdateError) throw orgUpdateError;

      toast({
        title: "Success",
        description: "Subscription created successfully",
      });

      navigate("/super-admin/subscriptions");
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedOrganization = organizations.find(org => org.id === subscriptionData.organization_id);
  const selectedPackage = packages.find(pkg => pkg.id === subscriptionData.package_id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/super-admin/subscriptions")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Subscription</h1>
            <p className="text-muted-foreground">
              Assign a package to an organization
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                Select organization and package to create a subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="organization">Organization *</Label>
                <Select 
                  value={subscriptionData.organization_id} 
                  onValueChange={(value) => setSubscriptionData(prev => ({ ...prev, organization_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="font-medium">{org.company_name}</div>
                            <div className="text-sm text-muted-foreground">{org.admin_email}</div>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {org.subscription_status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="package">Package *</Label>
                <Select 
                  value={subscriptionData.package_id} 
                  onValueChange={handlePackageSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        <div className="flex items-center gap-2">
                          <span>{pkg.name}</span>
                          <span className="text-muted-foreground">- {formatCurrency(pkg.price)}/{pkg.billing_type}</span>
                          {pkg.is_popular && <Badge variant="secondary">Popular</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billing_cycle">Billing Cycle</Label>
                  <Select 
                    value={subscriptionData.billing_cycle} 
                    onValueChange={(value: 'monthly' | 'yearly') => 
                      setSubscriptionData(prev => ({ ...prev, billing_cycle: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={subscriptionData.currency} 
                    onValueChange={(value) => setSubscriptionData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="starts_at">Start Date</Label>
                  <Input
                    id="starts_at"
                    type="date"
                    value={subscriptionData.starts_at}
                    onChange={(e) => setSubscriptionData(prev => ({ ...prev, starts_at: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="ends_at">End Date</Label>
                  <Input
                    id="ends_at"
                    type="date"
                    value={subscriptionData.ends_at}
                    onChange={(e) => setSubscriptionData(prev => ({ ...prev, ends_at: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={subscriptionData.amount}
                  onChange={(e) => setSubscriptionData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  disabled={!!selectedPackage}
                  className={selectedPackage ? "bg-muted" : ""}
                />
                {selectedPackage && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Amount automatically set from selected package
                  </p>
                )}
              </div>

              <Button 
                onClick={handleCreateSubscription} 
                disabled={loading} 
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {loading ? "Creating..." : "Create Subscription"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <div className="space-y-6">
            {selectedOrganization && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Selected Organization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">{selectedOrganization.company_name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedOrganization.admin_email}
                    </div>
                    <Badge variant="outline">
                      Current: {selectedOrganization.subscription_status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedPackage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Selected Package
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{selectedPackage.name}</span>
                        {selectedPackage.is_popular && (
                          <Badge variant="secondary">Popular</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedPackage.description}
                      </p>
                    </div>
                    
                    <div className="text-2xl font-bold">
                      {formatCurrency(selectedPackage.price)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{selectedPackage.billing_type}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>Users: {selectedPackage.user_limit === -1 ? 'Unlimited' : selectedPackage.user_limit}</div>
                      <div>Storage: {selectedPackage.storage_gb} GB</div>
                    </div>

                    {selectedPackage.features.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Features:</h4>
                        <ul className="text-sm space-y-1">
                          {selectedPackage.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}