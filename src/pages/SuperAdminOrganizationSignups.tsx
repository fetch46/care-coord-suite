import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, Mail, Phone, User, Calendar, CheckCircle, XCircle, Eye, UserPlus, TrendingUp, Clock, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface OrganizationSignup {
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
  organization_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function SuperAdminOrganizationSignups() {
  const [signups, setSignups] = useState<OrganizationSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignup, setSelectedSignup] = useState<OrganizationSignup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
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
      console.error('Error fetching organization signups:', error);
      toast({
        title: "Error",
        description: "Failed to load organization signups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSignupStatus = async (signupId: string, status: 'approved' | 'rejected') => {
    setUpdating(true);
    try {
      if (status === 'approved') {
        // Call the database function to approve the signup and create the organization
        const { data: approvalResult, error: approvalError } = await supabase
          .rpc('approve_tenant_signup', { p_signup_id: signupId });

        if (approvalError) {
          console.error('Error approving organization signup:', approvalError);
          throw approvalError;
        }

        // Parse the JSON response
        const result = approvalResult as { success: boolean; message?: string; organization_id?: string };
        
        if (!result?.success) {
          throw new Error(result?.message || 'Failed to approve organization signup');
        }

        // Update the notes if provided
        if (notes) {
          const { error: notesError } = await supabase
            .from('tenant_signups')
            .update({ notes })
            .eq('id', signupId);

          if (notesError) {
            console.error('Error updating notes:', notesError);
            // Don't throw here as the main approval was successful
          }
        }

        toast({
          title: "Success",
          description: `Organization signup approved and organization created successfully. The new organization will appear in the Organizations list.`
        });
      } else {
        // For rejection, just update the status
        const { error } = await supabase
          .from('tenant_signups')
          .update({
            status,
            processed_date: new Date().toISOString(),
            notes: notes || null
          })
          .eq('id', signupId);

        if (error) throw error;

        toast({
          title: "Success",
          description: `Organization signup ${status} successfully`
        });
      }

      await fetchSignups();
      setIsDialogOpen(false);
      setSelectedSignup(null);
      setNotes("");
      
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
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredSignups = signups.filter(signup => {
    const matchesStatus = statusFilter === "all" || signup.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      signup.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signup.admin_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${signup.admin_first_name} ${signup.admin_last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: signups.length,
    pending: signups.filter(s => s.status === 'pending').length,
    approved: signups.filter(s => s.status === 'approved').length,
    rejected: signups.filter(s => s.status === 'rejected').length
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading organization signups...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Organization Requests</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Review and manage organization signup requests
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search companies, emails, or contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Signup Requests</CardTitle>
              <Badge variant="outline" className="px-3 py-1">
                {filteredSignups.length} results
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSignups.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">No Requests Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "There are no organization signup requests at the moment"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Company</TableHead>
                      <TableHead className="w-[250px]">Admin Contact</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSignups.map((signup) => (
                      <TableRow key={signup.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{signup.company_name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{signup.admin_first_name} {signup.admin_last_name}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="w-3 h-3 mr-1" />
                              {signup.admin_email}
                            </div>
                            {signup.admin_phone && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="w-3 h-3 mr-1" />
                                {signup.admin_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize text-sm font-medium">
                            {signup.industry || 'Not specified'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {signup.company_size || 'Not specified'}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(signup.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{format(new Date(signup.created_at), 'MMM dd, yyyy')}</p>
                            <p className="text-muted-foreground">{format(new Date(signup.created_at), 'h:mm a')}</p>
                          </div>
                        </TableCell>
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
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedSignup(signup);
                                setNotes(signup.notes || "");
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader className="pb-6">
                              <DialogTitle className="text-2xl font-bold">Review Signup Request</DialogTitle>
                            </DialogHeader>
                            
                            {selectedSignup && (
                              <div className="space-y-8">
                                {/* Company Header */}
                                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6">
                                  <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                                      <Building2 className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="text-2xl font-bold">{selectedSignup.company_name}</h3>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="capitalize">{selectedSignup.industry || 'Industry not specified'}</span>
                                        <span>•</span>
                                        <span>{selectedSignup.company_size || 'Size not specified'}</span>
                                      </div>
                                      <div className="mt-3">
                                        {getStatusBadge(selectedSignup.status)}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Admin Notes */}
                                <div className="space-y-4">
                                  <Label htmlFor="admin-notes" className="text-base font-semibold">Admin Notes</Label>
                                  <Textarea
                                    id="admin-notes"
                                    placeholder="Add notes about this signup request..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>

                                {/* Action Buttons */}
                                {selectedSignup.status === 'pending' && (
                                  <div className="flex justify-end space-x-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => updateSignupStatus(selectedSignup.id, 'rejected')}
                                      disabled={updating}
                                      className="border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                      {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                      Reject Request
                                    </Button>
                                    <Button
                                      onClick={() => updateSignupStatus(selectedSignup.id, 'approved')}
                                      disabled={updating}
                                      className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                      {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                      Approve & Create Organization
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}