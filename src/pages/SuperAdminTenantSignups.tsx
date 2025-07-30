import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, Mail, Phone, User, Calendar, CheckCircle, XCircle, Eye, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface TenantSignup {
  id: string;
  company_name: string;
  admin_email: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_phone?: string;
  company_size?: string;
  industry?: string;
  status: string;
  signup_date: string;
  processed_date?: string;
  tenant_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function SuperAdminTenantSignups() {
  const [signups, setSignups] = useState<TenantSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignup, setSelectedSignup] = useState<TenantSignup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignups(data || []);
    } catch (error) {
      console.error('Error fetching tenant signups:', error);
      toast({
        title: "Error",
        description: "Failed to load tenant signups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSignupStatus = async (signupId: string, status: 'approved' | 'rejected') => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('tenant_signups')
        .update({
          status,
          processed_date: new Date().toISOString(),
          notes: notes || null
        })
        .eq('id', signupId);

      if (error) throw error;

      await fetchSignups();
      setIsDialogOpen(false);
      setSelectedSignup(null);
      setNotes("");
      
      toast({
        title: "Success",
        description: `Tenant signup ${status} successfully`
      });
    } catch (error) {
      console.error('Error updating signup status:', error);
      toast({
        title: "Error",
        description: "Failed to update signup status",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading tenant signups...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tenant Signup Requests</h1>
            <p className="text-muted-foreground">
              Manage incoming requests from organizations wanting to join the platform
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {signups.filter(s => s.status === 'pending').length} Pending
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Signup Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {signups.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Signup Requests</h3>
                <p className="text-muted-foreground">
                  There are no tenant signup requests at the moment.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Admin Contact</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signups.map((signup) => (
                    <TableRow key={signup.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{signup.company_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{signup.admin_first_name} {signup.admin_last_name}</p>
                          <p className="text-sm text-muted-foreground">{signup.admin_email}</p>
                          {signup.admin_phone && (
                            <p className="text-sm text-muted-foreground">{signup.admin_phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{signup.industry || 'N/A'}</TableCell>
                      <TableCell>{signup.company_size || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(signup.status)}</TableCell>
                      <TableCell>{format(new Date(signup.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Dialog 
                          open={isDialogOpen && selectedSignup?.id === signup.id} 
                          onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) {
                              setSelectedSignup(null);
                              setNotes("");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedSignup(signup);
                                setNotes(signup.notes || "");
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Review Tenant Signup Request</DialogTitle>
                            </DialogHeader>
                            
                            {selectedSignup && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
                                    <p className="font-medium">{selectedSignup.company_name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Industry</Label>
                                    <p className="capitalize">{selectedSignup.industry || 'Not specified'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Company Size</Label>
                                    <p>{selectedSignup.company_size || 'Not specified'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedSignup.status)}</div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Administrator Contact</Label>
                                  <div className="mt-2 p-3 bg-muted rounded-lg">
                                    <p className="font-medium">{selectedSignup.admin_first_name} {selectedSignup.admin_last_name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedSignup.admin_email}</p>
                                    {selectedSignup.admin_phone && (
                                      <p className="text-sm text-muted-foreground">{selectedSignup.admin_phone}</p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Signup Date</Label>
                                  <p>{format(new Date(selectedSignup.created_at), 'MMMM dd, yyyy at hh:mm a')}</p>
                                </div>

                                {selectedSignup.notes && (
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Existing Notes</Label>
                                    <p className="text-sm bg-muted p-2 rounded">{selectedSignup.notes}</p>
                                  </div>
                                )}

                                <div>
                                  <Label htmlFor="notes">Add Notes (Optional)</Label>
                                  <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes about this signup request..."
                                    rows={3}
                                  />
                                </div>

                                {selectedSignup.status === 'pending' && (
                                  <div className="flex gap-3 pt-4">
                                    <Button 
                                      onClick={() => updateSignupStatus(selectedSignup.id, 'approved')}
                                      disabled={updating}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button 
                                      onClick={() => updateSignupStatus(selectedSignup.id, 'rejected')}
                                      disabled={updating}
                                      variant="destructive"
                                      className="flex-1"
                                    >
                                      {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}