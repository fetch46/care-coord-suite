import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
  CreditCard,
  Plus,
  Filter
} from "lucide-react";

interface Tenant {
  id: string;
  company_name: string;
  domain?: string;
  admin_email: string;
  status: string;
  subscription_status: string;
  created_at: string;
  trial_ends_at?: string;
  subscriptions?: {
    id: string;
    status: string;
    amount: number;
    subscription_plans: {
      name: string;
    };
  }[];
}

export default function SuperAdminClients() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    filterTenants();
  }, [tenants, searchTerm, statusFilter]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tenants")
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
      setTenants(data || []);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTenants = () => {
    let filtered = tenants;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tenant =>
        tenant.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.admin_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.domain?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(tenant => tenant.subscription_status === statusFilter);
    }

    setFilteredTenants(filtered);
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

  const handleViewDetails = (tenantId: string) => {
    toast({
      title: "View Details",
      description: "Client details modal would open here"
    });
  };

  const handleLoginAs = (tenantId: string) => {
    toast({
      title: "Login As Client",
      description: "Would impersonate the client admin here"
    });
  };

  const handleViewSubscription = (tenantId: string) => {
    toast({
      title: "View Subscription",
      description: "Subscription details modal would open here"
    });
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
                  <p>Loading clients...</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Clients (Tenants)</h1>
                  <p className="text-muted-foreground">
                    Manage all tenant companies and their subscriptions
                  </p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search clients..."
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

              {/* Clients Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Clients ({filteredTenants.length})</CardTitle>
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
                        <TableHead>Monthly Revenue</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTenants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No clients found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTenants.map((tenant) => {
                          const activeSubscription = tenant.subscriptions?.find(s => s.status === 'active');
                          
                          return (
                            <TableRow key={tenant.id}>
                              <TableCell className="font-medium">{tenant.company_name}</TableCell>
                              <TableCell>{tenant.admin_email}</TableCell>
                              <TableCell>{tenant.domain || "-"}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(tenant.subscription_status)}>
                                  {tenant.subscription_status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {activeSubscription?.subscription_plans?.name || "No Plan"}
                              </TableCell>
                              <TableCell>
                                {activeSubscription ? formatCurrency(activeSubscription.amount) : "-"}
                              </TableCell>
                              <TableCell>
                                {new Date(tenant.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewDetails(tenant.id)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleLoginAs(tenant.id)}>
                                      <LogIn className="mr-2 h-4 w-4" />
                                      Login as Client
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewSubscription(tenant.id)}>
                                      <CreditCard className="mr-2 h-4 w-4" />
                                      View Subscription
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
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}