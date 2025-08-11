import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

export default function PaymentCreate() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    patient_id: '',
    invoice_id: '',
    payment_date: new Date().toISOString().split('T')[0],
    amount: 0,
    payment_method: 'cash',
    status: 'pending',
    reference_number: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [{ data: pts }, { data: invs }] = await Promise.all([
        supabase.from('patients').select('id, first_name, last_name').order('first_name'),
        supabase.from('invoices').select('id, invoice_number, patient_id').order('invoice_date', { ascending: false }),
      ]);
      setPatients(pts || []);
      setInvoices(invs || []);
    };
    load();
  }, []);

  const generatePaymentNumber = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PAY-${y}${m}-${rand}`;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from('payments').insert([{
        payment_number: generatePaymentNumber(),
        patient_id: form.patient_id || null,
        invoice_id: form.invoice_id || null,
        amount: Number(form.amount),
        payment_method: form.payment_method,
        status: form.status,
        payment_date: form.payment_date,
        reference_number: form.reference_number || null,
      }]);
      if (error) throw error;
      navigate('/payments');
    } catch (e) {
      console.error('Error saving payment', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = form.patient_id ? invoices.filter((i) => i.patient_id === form.patient_id) : invoices;

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
                  <Link to="/payments">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Payments
                  </Link>
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" /> Save Payment
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Record Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient</Label>
                      <Select value={form.patient_id} onValueChange={(v) => setForm({ ...form, patient_id: v, invoice_id: '' })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Invoice</Label>
                      <Select value={form.invoice_id} onValueChange={(v) => setForm({ ...form, invoice_id: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select invoice" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredInvoices.map(i => (
                            <SelectItem key={i.id} value={i.id}>{i.invoice_number}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Date</Label>
                      <Input type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Method</Label>
                      <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
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
                      <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
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
                      <Label>Reference #</Label>
                      <Input value={form.reference_number} onChange={(e) => setForm({ ...form, reference_number: e.target.value })} />
                    </div>
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
