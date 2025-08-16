import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, DollarSign, Calendar, CreditCard, FileText } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  payment_number: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
  reference_number?: string;
  notes?: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  invoice: {
    invoice_number: string;
  };
}

export default function PaymentView() {
  const { id } = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPayment();
    }
  }, [id]);

  const fetchPayment = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          patient:patients!patient_id(first_name, last_name),
          invoice:invoices!invoice_id(invoice_number)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setPayment(data);
    } catch (error) {
      console.error("Error fetching payment:", error);
    } finally {
      setLoading(false);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
                <div>Loading payment...</div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!payment) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-full">
                <div>Payment not found</div>
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
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/payments">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Payments
                    </Link>
                  </Button>
                </div>
                <Button variant="outline" asChild>
                  <Link to={`/payments/${payment.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Payment
                  </Link>
                </Button>
              </div>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-6 h-6 text-primary" />
                      <div>
                        <CardTitle className="text-2xl">Payment #{payment.payment_number}</CardTitle>
                        <p className="text-muted-foreground">
                          Payment details and transaction information
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Amount</p>
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                        <p className="font-semibold">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                        <p className="font-semibold capitalize">
                          {payment.payment_method.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Patient and Invoice Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Patient Information
                      </h3>
                      <p className="text-lg font-medium">
                        {payment.patient.first_name} {payment.patient.last_name}
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Invoice
                      </h3>
                      <p className="text-lg font-medium">
                        {payment.invoice.invoice_number}
                      </p>
                    </div>
                  </div>

                  {/* Reference Number */}
                  {payment.reference_number && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Reference Number</h3>
                      <p className="text-blue-900 font-mono">
                        {payment.reference_number}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {payment.notes && (
                    <div>
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="leading-relaxed">{payment.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}