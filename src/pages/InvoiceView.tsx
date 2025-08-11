import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select(`*, patients(first_name, last_name)`) // header + patient
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;
        setInvoice(data);

        const { data: itemsData, error: itemsError } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', id);
        if (itemsError) throw itemsError;
        setItems(itemsData || []);
      } catch (e) {
        console.error('Error loading invoice', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInvoice();
  }, [id]);

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n||0));

  if (loading) return <div className="p-6">Loading...</div>;
  if (!invoice) return <div className="p-6">Invoice not found</div>;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                  <Link to="/billing">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Billing
                  </Link>
                </Button>
                <Button onClick={() => navigate(`/billing/invoice/${id}/edit`)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit Invoice
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Invoice {invoice.invoice_number}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Patient</div>
                      <div className="text-lg font-medium">{invoice.patients ? `${invoice.patients.first_name} ${invoice.patients.last_name}` : '—'}</div>
                    </div>
                    <div className="text-right">
                      <Badge>{invoice.status}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Invoice Date</div>
                      <div>{new Date(invoice.invoice_date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Due Date</div>
                      <div>{new Date(invoice.due_date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell>{it.description}</TableCell>
                          <TableCell>{it.service_date ? new Date(it.service_date).toLocaleDateString() : '—'}</TableCell>
                          <TableCell>{it.quantity}</TableCell>
                          <TableCell>{formatCurrency(it.unit_price)}</TableCell>
                          <TableCell>{formatCurrency(it.total_price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(invoice.subtotal)}</span></div>
                      <div className="flex justify-between"><span>Tax:</span><span>{formatCurrency(invoice.tax_amount)}</span></div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2"><span>Total:</span><span>{formatCurrency(invoice.total_amount)}</span></div>
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
