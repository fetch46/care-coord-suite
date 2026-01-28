import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp,
  Eye,
  LogIn,
  Settings,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Sparkles,
  ChevronRight,
  Package,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalOrganizations: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  totalRevenue: number;
  trialOrganizations: number;
  activeUsers: number;
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
  status?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  { 
    title: "Add Organization", 
    description: "Register a new organization", 
    icon: Building2, 
    href: "/super-admin/organizations",
    color: "bg-blue-500"
  },
  { 
    title: "Manage Packages", 
    description: "Configure subscription plans", 
    icon: Package, 
    href: "/super-admin/packages",
    color: "bg-purple-500"
  },
  { 
    title: "User Management", 
    description: "Manage platform users", 
    icon: Users, 
    href: "/super-admin/users",
    color: "bg-green-500"
  },
  { 
    title: "System Settings", 
    description: "Configure platform settings", 
    icon: Settings, 
    href: "/super-admin/settings",
    color: "bg-orange-500"
  },
];

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrganizations: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    totalRevenue: 0,
    trialOrganizations: 0,
    activeUsers: 0
  });
  const [recentOrganizations, setRecentOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
      const trialOrganizations = organizations?.filter(o => o.subscription_status === 'trial').length || 0;

      setStats({
        totalOrganizations,
        activeSubscriptions,
        expiredSubscriptions,
        totalRevenue: totalRevenue / 100,
        trialOrganizations,
        activeUsers: totalOrganizations * 5 // Placeholder calculation
      });

      setRecentOrganizations(organizations?.slice(0, 5) || []);
      
      if (isRefresh) {
        toast({
          title: "Dashboard refreshed",
          description: "All data has been updated"
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" />Trial</Badge>;
      case 'expired':
      case 'canceled':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back, Admin</h1>
                <p className="text-muted-foreground">
                  Here's what's happening across your platform today
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Organizations</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Building2 className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalOrganizations}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.activeSubscriptions}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Trial Organizations</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.trialOrganizations}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Activity className="w-3 h-3" />
                <span>{stats.expiredSubscriptions} expired</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+23% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Organizations */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto p-4 justify-start hover:bg-muted/50 hover:border-purple-200 group transition-all"
                  onClick={() => navigate(action.href)}
                >
                  <div className={`${action.color} p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-foreground">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Organizations */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  Recent Organizations
                </CardTitle>
                <CardDescription>Latest registered companies</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/super-admin/organizations')}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrganizations.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No organizations registered yet</p>
                  </div>
                ) : (
                  recentOrganizations.map((organization, index) => (
                    <div 
                      key={organization.id} 
                      className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/30 hover:border-purple-200 transition-all group animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center text-purple-700 font-bold text-sm">
                          {organization.company_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground group-hover:text-purple-700 transition-colors">
                            {organization.company_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{organization.admin_email || 'No email'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(organization.subscription_status)}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-purple-100 hover:text-purple-700"
                            onClick={() => navigate(`/super-admin/organizations/${organization.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-purple-100 hover:text-purple-700"
                            onClick={() => navigate(`/super-admin/organizations/${organization.id}/settings`)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        {stats.expiredSubscriptions > 0 && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-orange-800">Attention Required</h4>
                <p className="text-sm text-orange-700">
                  {stats.expiredSubscriptions} subscription(s) have expired and need attention.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
                onClick={() => navigate('/super-admin/subscriptions')}
              >
                Review Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </SuperAdminLayout>
  );
}
