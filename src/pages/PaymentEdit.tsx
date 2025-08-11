import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
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

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from('payments').update({
        payment_date: payment.payment_date,
        amount: Number(payment.amount),
        payment_method: payment.payment_method,
        status: payment.status,
        reference_number: payment.reference_number || null,
      }).eq('id', id);
      if (error) throw error;
      navigate(`/payments`);
    } catch (e) {
      console.error('Error updating payment', e);
    } finally {
      setLoading(false);
    }
  };

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
              <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                  <Link to={`/payments`}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Payments
                  </Link>
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Edit Payment</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={payment.payment_date?.split('T')[0] || ''} onChange={(e) => setPayment({ ...payment, payment_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Method</Label>
                    <Select value={payment.payment_method} onValueChange={(v) => setPayment({ ...payment, payment_method: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={payment.status} onValueChange={(v) => setPayment({ ...payment, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Reference</Label>
                    <Input value={payment.reference_number || ''} onChange={(e) => setPayment({ ...payment, reference_number: e.target.value })} />
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
