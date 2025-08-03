import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, DollarSign, FileText, CreditCard, AlertCircle } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  status: string;
  patient: {
    first_name: string;
    last_name: string;
  };
}

interface BillingStats {
  total_revenue: number;
  pending_amount: number;
  overdue_amount: number;
  total_invoices: number;
}

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState<BillingStats>({
    total_revenue: 0,
    pending_amount: 0,
    overdue_amount: 0,
    total_invoices: 0,
  });

  useEffect(() => {
    fetchInvoices();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("invoices")
        .select(`
          *,
          patient:patients(first_name, last_name)
        `)
        .order("invoice_date", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching invoices:", error);
        return;
      }

      let filteredData = data || [];

      if (searchTerm) {
        filteredData = filteredData.filter((invoice) =>
          invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${invoice.patient.first_name} ${invoice.patient.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      setInvoices(filteredData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("total_amount, status");

      if (invoicesData) {
        const totalRevenue = invoicesData
          .filter(inv => inv.status === "paid")
          .reduce((sum, inv) => sum + (typeof inv.total_amount === 'string' ? parseFloat(inv.total_amount) : inv.total_amount), 0);

        const pendingAmount = invoicesData
          .filter(inv => inv.status === "sent")
          .reduce((sum, inv) => sum + (typeof inv.total_amount === 'string' ? parseFloat(inv.total_amount) : inv.total_amount), 0);

        const overdueAmount = invoicesData
          .filter(inv => inv.status === "overdue")
          .reduce((sum, inv) => sum + (typeof inv.total_amount === 'string' ? parseFloat(inv.total_amount) : inv.total_amount), 0);

        setStats({
          total_revenue: totalRevenue,
          pending_amount: pendingAmount,
          overdue_amount: overdueAmount,
          total_invoices: invoicesData.length,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "sent":
        return "secondary";
      case "overdue":
        return "destructive";
      case "draft":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Billing & Invoices</h1>
                <Button asChild>
                  <Link to="/billing/invoice/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Link>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(stats.total_revenue)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(stats.pending_amount)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(stats.overdue_amount)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total_invoices}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Invoices Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            Loading invoices...
                          </TableCell>
                        </TableRow>
                      ) : invoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No invoices found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">
                              {invoice.invoice_number}
                            </TableCell>
                            <TableCell>
                              {invoice.patient.first_name} {invoice.patient.last_name}
                            </TableCell>
                            <TableCell>
                              {new Date(invoice.invoice_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(invoice.due_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(invoice.total_amount)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(invoice.status)}>
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/billing/invoice/${invoice.id}`}>
                                    View
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/billing/invoice/${invoice.id}/edit`}>
                                    Edit
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
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