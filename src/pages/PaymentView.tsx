import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentView() {
  const { id } = useParams();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select(`*, patients(first_name, last_name), invoices(invoice_number)`)  
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;
        setPayment(data);
      } catch (e) {
        console.error('Error loading payment', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n||0));

  if (loading) return <div className="p-6">Loading...</div>;
  if (!payment) return <div className="p-6">Payment not found</div>;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <Button variant="ghost" asChild>
                <Link to="/payments">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Payments
                </Link>
              </Button>

              <Card>
                <CardHeader>
                  <CardTitle>Payment {payment.payment_number}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><span className="text-muted-foreground">Patient: </span>{payment.patients ? `${payment.patients.first_name} ${payment.patients.last_name}` : '—'}</div>
                  <div><span className="text-muted-foreground">Invoice: </span>{payment.invoices ? payment.invoices.invoice_number : '—'}</div>
                  <div><span className="text-muted-foreground">Date: </span>{new Date(payment.payment_date).toLocaleDateString()}</div>
                  <div><span className="text-muted-foreground">Amount: </span>{fmt(payment.amount)}</div>
                  <div><span className="text-muted-foreground">Method: </span>{payment.payment_method}</div>
                  <div><span className="text-muted-foreground">Status: </span>{payment.status}</div>
                  <div><span className="text-muted-foreground">Reference: </span>{payment.reference_number || '-'}</div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
