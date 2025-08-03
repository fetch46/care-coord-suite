import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, DollarSign, CreditCard, CheckCircle, Clock } from "lucide-react";
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

interface Payment {
  id: string;
  payment_number: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
  reference_number?: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  invoice: {
    invoice_number: string;
  };
}

interface PaymentStats {
  total_payments: number;
  pending_payments: number;
  completed_payments: number;
  failed_payments: number;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [stats, setStats] = useState<PaymentStats>({
    total_payments: 0,
    pending_payments: 0,
    completed_payments: 0,
    failed_payments: 0,
  });

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [searchTerm, statusFilter, methodFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("payments")
        .select(`
          *,
          patient:patients(first_name, last_name),
          invoice:invoices(invoice_number)
        `)
        .order("payment_date", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (methodFilter !== "all") {
        query = query.eq("payment_method", methodFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching payments:", error);
        return;
      }

      let filteredData = data || [];

      if (searchTerm) {
        filteredData = filteredData.filter((payment) =>
          payment.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${payment.patient.first_name} ${payment.patient.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      setPayments(filteredData);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: paymentsData } = await supabase
        .from("payments")
        .select("amount, status");

      if (paymentsData) {
        const totalPayments = paymentsData
          .reduce((sum, payment) => sum + (typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount), 0);

        const pendingPayments = paymentsData
          .filter(payment => payment.status === "pending")
          .reduce((sum, payment) => sum + (typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount), 0);

        const completedPayments = paymentsData
          .filter(payment => payment.status === "completed")
          .reduce((sum, payment) => sum + (typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount), 0);

        const failedPayments = paymentsData
          .filter(payment => payment.status === "failed")
          .reduce((sum, payment) => sum + (typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount), 0);

        setStats({
          total_payments: totalPayments,
          pending_payments: pendingPayments,
          completed_payments: completedPayments,
          failed_payments: failedPayments,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPaymentMethod = (method: string) => {
    return method
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
                <h1 className="text-2xl font-bold">Payments</h1>
                <Button asChild>
                  <Link to="/payments/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Record Payment
                  </Link>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(stats.total_payments)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(stats.completed_payments)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(stats.pending_payments)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Failed</CardTitle>
                    <CreditCard className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(stats.failed_payments)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search payments..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payments Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment #</TableHead>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            Loading payments...
                          </TableCell>
                        </TableRow>
                      ) : payments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            No payments found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.payment_number}
                            </TableCell>
                            <TableCell>
                              {payment.invoice.invoice_number}
                            </TableCell>
                            <TableCell>
                              {payment.patient.first_name} {payment.patient.last_name}
                            </TableCell>
                            <TableCell>
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>
                              {formatPaymentMethod(payment.payment_method)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={getStatusColor(payment.status)}
                                className="flex items-center gap-1 w-fit"
                              >
                                {getStatusIcon(payment.status)}
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {payment.reference_number || "-"}
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