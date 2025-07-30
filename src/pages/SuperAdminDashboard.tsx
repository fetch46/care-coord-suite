import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
  totalTenants: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  totalRevenue: number;
}

interface Tenant {
  id: string;
  company_name: string;
  admin_email: string;
  status: string;
  subscription_status: string;
  created_at: string;
  trial_ends_at?: string;
}

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalTenants: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    totalRevenue: 0
  });
  const [recentTenants, setRecentTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch tenants
      const { data: tenants, error: tenantsError } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false });

      if (tenantsError) throw tenantsError;

      // Fetch subscriptions
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from("subscriptions")
        .select("*");

      if (subscriptionsError) throw subscriptionsError;

      // Calculate stats
      const totalTenants = tenants?.length || 0;
      const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
      const expiredSubscriptions = subscriptions?.filter(s => s.status === 'expired' || s.status === 'canceled').length || 0;
      const totalRevenue = subscriptions?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

      setStats({
        totalTenants,
        activeSubscriptions,
        expiredSubscriptions,
        totalRevenue: totalRevenue / 100 // Convert from cents
      });

      setRecentTenants(tenants?.slice(0, 5) || []);
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
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading dashboard...</p>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
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
                    <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalTenants}</div>
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

              {/* Recent Tenants */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tenants</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Recently registered companies and their status
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTenants.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No tenants found
                      </div>
                    ) : (
                      recentTenants.map((tenant) => (
                        <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{tenant.company_name}</h4>
                              <Badge variant={getStatusBadgeVariant(tenant.subscription_status)}>
                                {tenant.subscription_status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{tenant.admin_email}</p>
                            <p className="text-xs text-muted-foreground">
                              Registered: {new Date(tenant.created_at).toLocaleDateString()}
                              {tenant.trial_ends_at && (
                                <span className="ml-2">
                                  • Trial ends: {new Date(tenant.trial_ends_at).toLocaleDateString()}
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}