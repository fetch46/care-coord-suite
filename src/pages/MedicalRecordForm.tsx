import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, FileText } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

export default function MedicalRecordForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const preSelectedPatientId = searchParams.get('patient_id');
  const isEditing = Boolean(id);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: preSelectedPatientId || "",
    title: "",
    record_type: "",
    description: "",
    recorded_by: "",
    recorded_date: new Date().toISOString().split('T')[0],
    is_confidential: false
  });

  useEffect(() => {
    fetchPatients();
    if (isEditing) {
      fetchMedicalRecord();
    }
  }, [id]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name')
        .eq('status', 'Active')
        .order('last_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients.",
        variant: "destructive",
      });
    }
  };

  const fetchMedicalRecord = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setFormData({
        patient_id: data.patient_id || "",
        title: data.title || "",
        record_type: data.record_type || "",
        description: data.description || "",
        recorded_by: data.recorded_by || "",
        recorded_date: data.recorded_date ? new Date(data.recorded_date).toISOString().split('T')[0] : "",
        is_confidential: data.is_confidential || false
      });
    } catch (error) {
      console.error('Error fetching medical record:', error);
      toast({
        title: "Error",
        description: "Failed to load medical record.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.patient_id || !formData.title || !formData.record_type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const recordData = {
        ...formData,
        recorded_date: new Date(formData.recorded_date).toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase
          .from('medical_records')
          .update(recordData)
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Medical record updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('medical_records')
          .insert([recordData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Medical record created successfully.",
        });
      }

      navigate('/medical-records');
    } catch (error) {
      console.error('Error saving medical record:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} medical record.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading && isEditing) {
    return <div className="p-6">Loading...</div>;
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
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/medical-records')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Medical Records
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {isEditing ? 'Edit Medical Record' : 'New Medical Record'}
                  </h1>
                  <p className="text-muted-foreground">
                    {isEditing ? 'Update medical record information' : 'Create a new medical record'}
                  </p>
                </div>
              </div>

              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Medical Record Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="patient_id">Patient *</Label>
                      <Select 
                        value={formData.patient_id} 
                        onValueChange={(value) => handleInputChange('patient_id', value)}
                        disabled={Boolean(preSelectedPatientId)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.last_name}, {patient.first_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {preSelectedPatientId && (
                        <p className="text-sm text-muted-foreground">Patient pre-selected from patient profile</p>
                      )}
                    </div>

                    {/* Record Type */}
                    <div className="space-y-2">
                      <Label htmlFor="record_type">Record Type *</Label>
                      <Select 
                        value={formData.record_type} 
                        onValueChange={(value) => handleInputChange('record_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select record type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="diagnosis">Diagnosis</SelectItem>
                          <SelectItem value="treatment">Treatment</SelectItem>
                          <SelectItem value="test_result">Test Result</SelectItem>
                          <SelectItem value="prescription">Prescription</SelectItem>
                          <SelectItem value="progress_note">Progress Note</SelectItem>
                          <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter record title"
                      />
                    </div>

                    {/* Recorded By */}
                    <div className="space-y-2">
                      <Label htmlFor="recorded_by">Recorded By</Label>
                      <Input
                        id="recorded_by"
                        value={formData.recorded_by}
                        onChange={(e) => handleInputChange('recorded_by', e.target.value)}
                        placeholder="Enter name of recorder"
                      />
                    </div>

                    {/* Recorded Date */}
                    <div className="space-y-2">
                      <Label htmlFor="recorded_date">Recorded Date</Label>
                      <Input
                        id="recorded_date"
                        type="date"
                        value={formData.recorded_date}
                        onChange={(e) => handleInputChange('recorded_date', e.target.value)}
                      />
                    </div>

                    {/* Confidential */}
                    <div className="space-y-2">
                      <Label htmlFor="is_confidential">Confidential</Label>
                      <Select 
                        value={formData.is_confidential.toString()} 
                        onValueChange={(value) => handleInputChange('is_confidential', value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">No</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter detailed description of the medical record"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/medical-records')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-primary text-white hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : (isEditing ? 'Update Record' : 'Save Record')}
                </Button>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}