import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  FileText
} from "lucide-react";
import { format } from "date-fns";

interface TimesheetApproval {
  id: string;
  timesheet_id: string;
  approver_id: string;
  status: 'pending' | 'approved' | 'rejected';
  approval_date: string | null;
  rejection_reason: string | null;
  notes: string | null;
  timesheet: {
    id: string;
    work_date: string;
    time_in: string;
    time_out: string;
    total_hours: number;
    caregiver_id: string;
    patient_id: string;
    status: string;
    approval_status: string;
  };
  caregiver: {
    first_name: string;
    last_name: string;
  };
  patient: {
    first_name: string;
    last_name: string;
  };
}

interface TimesheetApprovalManagerProps {
  onApprovalUpdate?: () => void;
}

export function TimesheetApprovalManager({ onApprovalUpdate }: TimesheetApprovalManagerProps) {
  const { toast } = useToast();
  const [approvals, setApprovals] = useState<TimesheetApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timesheets')
        .select(`
          id,
          work_date,
          time_in,
          time_out,
          total_hours,
          caregiver_id,
          patient_id,
          status,
          approval_status,
          caregivers!inner(first_name, last_name),
          patients!inner(first_name, last_name)
        `)
        .eq('approval_status', 'pending')
        .order('work_date', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = data?.map(timesheet => ({
        id: `timesheet-${timesheet.id}`,
        timesheet_id: timesheet.id,
        approver_id: '',
        status: 'pending' as const,
        approval_date: null,
        rejection_reason: null,
        notes: null,
        timesheet: timesheet,
        caregiver: timesheet.caregivers,
        patient: timesheet.patients
      })) || [];

      setApprovals(transformedData);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      toast({
        title: "Error",
        description: "Failed to load pending timesheet approvals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveTimesheet = async (timesheetId: string) => {
    try {
      setProcessingId(timesheetId);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Update timesheet approval status
      const { error: timesheetError } = await supabase
        .from('timesheets')
        .update({ approval_status: 'approved' })
        .eq('id', timesheetId);

      if (timesheetError) throw timesheetError;

      // Create approval record
      const { error: approvalError } = await supabase
        .from('timesheet_approvals')
        .insert({
          timesheet_id: timesheetId,
          approver_id: user.id,
          status: 'approved',
          approval_date: new Date().toISOString()
        });

      if (approvalError) throw approvalError;

      toast({
        title: "Success",
        description: "Timesheet approved successfully"
      });

      fetchPendingApprovals();
      onApprovalUpdate?.();
    } catch (error) {
      console.error('Error approving timesheet:', error);
      toast({
        title: "Error",
        description: "Failed to approve timesheet",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const rejectTimesheet = async (timesheetId: string) => {
    const reason = rejectionReason[timesheetId];
    if (!reason?.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessingId(timesheetId);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Update timesheet approval status
      const { error: timesheetError } = await supabase
        .from('timesheets')
        .update({ approval_status: 'rejected' })
        .eq('id', timesheetId);

      if (timesheetError) throw timesheetError;

      // Create approval record
      const { error: approvalError } = await supabase
        .from('timesheet_approvals')
        .insert({
          timesheet_id: timesheetId,
          approver_id: user.id,
          status: 'rejected',
          rejection_reason: reason
        });

      if (approvalError) throw approvalError;

      toast({
        title: "Success",
        description: "Timesheet rejected successfully"
      });

      // Clear the rejection reason
      setRejectionReason(prev => ({ ...prev, [timesheetId]: '' }));
      
      fetchPendingApprovals();
      onApprovalUpdate?.();
    } catch (error) {
      console.error('Error rejecting timesheet:', error);
      toast({
        title: "Error",
        description: "Failed to reject timesheet",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading pending approvals...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Timesheet Approvals</h3>
        <p className="text-sm text-muted-foreground">
          Review and approve or reject submitted timesheets
        </p>
      </div>

      {approvals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
            <p className="text-muted-foreground">
              All timesheets have been reviewed and processed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <Card key={approval.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {approval.caregiver.first_name} {approval.caregiver.last_name}
                      </h3>
                      <Badge className={getStatusColor(approval.status)}>
                        {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Patient: {approval.patient.first_name} {approval.patient.last_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Date: {format(new Date(approval.timesheet.work_date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Hours: {approval.timesheet.total_hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>
                          {approval.timesheet.time_in} - {approval.timesheet.time_out}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {approval.status === 'pending' && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor={`rejection-reason-${approval.timesheet_id}`}>
                        Rejection Reason (optional)
                      </Label>
                      <Textarea
                        id={`rejection-reason-${approval.timesheet_id}`}
                        placeholder="Enter reason for rejection if applicable..."
                        value={rejectionReason[approval.timesheet_id] || ''}
                        onChange={(e) => setRejectionReason(prev => ({
                          ...prev,
                          [approval.timesheet_id]: e.target.value
                        }))}
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => approveTimesheet(approval.timesheet_id)}
                        disabled={processingId === approval.timesheet_id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => rejectTimesheet(approval.timesheet_id)}
                        disabled={processingId === approval.timesheet_id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}