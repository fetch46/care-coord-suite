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

export default function InvoiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;
        setInvoice(data);
      } catch (e) {
        console.error('Error loading invoice', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInvoice();
  }, [id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('invoices')
        .update({
          invoice_date: invoice.invoice_date,
          due_date: invoice.due_date,
          status: invoice.status,
          notes: invoice.notes,
        })
        .eq('id', id);
      if (error) throw error;
      navigate(`/billing/invoice/${id}`);
    } catch (e) {
      console.error('Error updating invoice', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!invoice) return <div className="p-6">Invoice not found</div>;

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
                  <Link to={`/billing/invoice/${id}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Invoice
                  </Link>
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Edit Invoice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Invoice Date</Label>
                      <Input type="date" value={invoice.invoice_date?.split('T')[0] || ''} onChange={(e) => setInvoice({ ...invoice, invoice_date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" value={invoice.due_date?.split('T')[0] || ''} onChange={(e) => setInvoice({ ...invoice, due_date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={invoice.status} onValueChange={(v) => setInvoice({ ...invoice, status: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input value={invoice.notes || ''} onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })} placeholder="Notes" />
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
