import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchPayment();
    }
  }, [id]);

  const fetchPayment = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
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

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("payments")
        .update({
          amount: Number(payment.amount),
          payment_method: payment.payment_method,
          status: payment.status,
          payment_date: payment.payment_date,
          reference_number: payment.reference_number || null,
          notes: payment.notes || null,
        })
        .eq("id", id);

      if (error) throw error;
      navigate(`/payments/${id}`);
    } catch (error) {
      console.error("Error updating payment:", error);
    } finally {
      setSaving(false);
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
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                  <Link to={`/payments/${id}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Payment
                  </Link>
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Edit Payment #{payment.payment_number}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Payment Date</Label>
                      <Input
                        type="date"
                        value={payment.payment_date}
                        onChange={(e) => setPayment({ ...payment, payment_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select
                        value={payment.payment_method}
                        onValueChange={(v) => setPayment({ ...payment, payment_method: v })}
                      >
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
                      <Select
                        value={payment.status}
                        onValueChange={(v) => setPayment({ ...payment, status: v })}
                      >
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
                    <div className="space-y-2">
                      <Label>Reference Number</Label>
                      <Input
                        value={payment.reference_number || ""}
                        onChange={(e) => setPayment({ ...payment, reference_number: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={payment.notes || ""}
                      onChange={(e) => setPayment({ ...payment, notes: e.target.value })}
                      rows={3}
                    />
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