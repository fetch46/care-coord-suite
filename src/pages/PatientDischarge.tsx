import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FileCheck, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
}

export default function PatientDischarge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [dischargeData, setDischargeData] = useState({
    discharge_date: new Date().toISOString().split('T')[0],
    discharge_reason: '',
    discharge_disposition: '',
    discharge_instructions: '',
    follow_up_required: false,
    follow_up_provider: '',
    follow_up_date: '',
    medications_at_discharge: '',
    discharge_summary: '',
  });

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name, status')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPatient(data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      toast({
        title: "Error",
        description: "Failed to load patient data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setDischargeData(prev => ({ ...prev, [field]: value }));
  };

  const handleDischarge = async () => {
    if (!dischargeData.discharge_reason.trim() || !dischargeData.discharge_disposition.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the discharge reason and disposition",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Update patient status to discharged
      const { error: patientError } = await supabase
        .from('patients')
        .update({ 
          status: 'Discharged',
          date_of_discharge: dischargeData.discharge_date 
        })
        .eq('id', id);

      if (patientError) throw patientError;

      // Create discharge record (you might want to create a separate discharge table)
      // For now, we'll update the patient record with discharge information
      
      toast({
        title: "Patient Discharged",
        description: "Patient has been successfully discharged",
      });

      navigate(`/patients/${id}`);
    } catch (error) {
      console.error('Error discharging patient:', error);
      toast({
        title: "Error",
        description: "Failed to discharge patient",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !patient) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-full">
                <div>Loading patient data...</div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!patient) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-full">
                <div>Patient not found</div>
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
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/patients/${id}`)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Patient
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold">Discharge Patient</h1>
                    <p className="text-muted-foreground">
                      {patient.first_name} {patient.last_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Alert */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This action will discharge the patient and change their status to "Discharged". 
                  Please ensure all necessary documentation is complete before proceeding.
                </AlertDescription>
              </Alert>

              {/* Discharge Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Discharge Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discharge_date">Discharge Date</Label>
                      <Input
                        id="discharge_date"
                        type="date"
                        value={dischargeData.discharge_date}
                        onChange={(e) => handleInputChange('discharge_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="discharge_disposition">Discharge Disposition</Label>
                      <Select
                        value={dischargeData.discharge_disposition}
                        onValueChange={(value) => handleInputChange('discharge_disposition', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select disposition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="assisted_living">Assisted Living</SelectItem>
                          <SelectItem value="nursing_home">Nursing Home</SelectItem>
                          <SelectItem value="hospital">Hospital Transfer</SelectItem>
                          <SelectItem value="hospice">Hospice Care</SelectItem>
                          <SelectItem value="deceased">Deceased</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="discharge_reason">Discharge Reason</Label>
                    <Textarea
                      id="discharge_reason"
                      value={dischargeData.discharge_reason}
                      onChange={(e) => handleInputChange('discharge_reason', e.target.value)}
                      placeholder="Reason for discharge..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="discharge_summary">Discharge Summary</Label>
                    <Textarea
                      id="discharge_summary"
                      value={dischargeData.discharge_summary}
                      onChange={(e) => handleInputChange('discharge_summary', e.target.value)}
                      placeholder="Summary of care provided, patient condition, etc..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="discharge_instructions">Discharge Instructions</Label>
                    <Textarea
                      id="discharge_instructions"
                      value={dischargeData.discharge_instructions}
                      onChange={(e) => handleInputChange('discharge_instructions', e.target.value)}
                      placeholder="Instructions for patient/family..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="medications_at_discharge">Medications at Discharge</Label>
                    <Textarea
                      id="medications_at_discharge"
                      value={dischargeData.medications_at_discharge}
                      onChange={(e) => handleInputChange('medications_at_discharge', e.target.value)}
                      placeholder="List of medications patient should continue..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="follow_up_provider">Follow-up Provider</Label>
                      <Input
                        id="follow_up_provider"
                        value={dischargeData.follow_up_provider}
                        onChange={(e) => handleInputChange('follow_up_provider', e.target.value)}
                        placeholder="Provider name for follow-up"
                      />
                    </div>
                    <div>
                      <Label htmlFor="follow_up_date">Follow-up Date</Label>
                      <Input
                        id="follow_up_date"
                        type="date"
                        value={dischargeData.follow_up_date}
                        onChange={(e) => handleInputChange('follow_up_date', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/patients/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDischarge}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <FileCheck className="w-4 h-4 mr-2" />
                      Discharge Patient
                    </Button>
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