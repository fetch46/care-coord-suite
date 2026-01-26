import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp,
  Eye,
  LogIn,
  Settings,
  AlertTriangle
} from "lucide-react";

interface DashboardStats {
  totalOrganizations: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  totalRevenue: number;
}

interface Organization {
  id: string;
  company_name: string;
  email?: string;
  admin_email?: string;
  is_active?: boolean;
  subscription_status?: string;
  created_at: string;
  trial_ends_at?: string;
}

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrganizations: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    totalRevenue: 0
  });
  const [recentOrganizations, setRecentOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch organizations
      const { data: organizations, error: organizationsError } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });

      if (organizationsError) throw organizationsError;

      // Fetch subscriptions
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from("subscriptions")
        .select("*");

      if (subscriptionsError) throw subscriptionsError;

      // Calculate stats
      const totalOrganizations = organizations?.length || 0;
      const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
      const expiredSubscriptions = subscriptions?.filter(s => s.status === 'expired' || s.status === 'canceled').length || 0;
      const totalRevenue = subscriptions?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

      setStats({
        totalOrganizations,
        activeSubscriptions,
        expiredSubscriptions,
        totalRevenue: totalRevenue / 100 // Convert from cents
      });

      setRecentOrganizations(organizations?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all tenants, subscriptions, and system health
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              Registered companies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Currently paying customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Subscriptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiredSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Monthly recurring revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Organizations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Organizations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Recently registered companies and their status
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrganizations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No organizations found
              </div>
            ) : (
              recentOrganizations.map((organization) => (
                <div key={organization.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{organization.company_name}</h4>
                      <Badge variant={getStatusBadgeVariant(organization.subscription_status)}>
                        {organization.subscription_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{organization.admin_email}</p>
                    <p className="text-xs text-muted-foreground">
                      Registered: {new Date(organization.created_at).toLocaleDateString()}
                      {organization.trial_ends_at && (
                        <span className="ml-2">
                          • Trial ends: {new Date(organization.trial_ends_at).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login As
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </SuperAdminLayout>
  );
}