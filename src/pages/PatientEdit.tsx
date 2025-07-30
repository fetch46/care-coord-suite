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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  sex?: string;
  race?: string;
  address?: string;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  care_level?: string;
  room_number?: string;
  status: string;
  ssn?: string;
  referral_source?: string;
  date_of_discharge?: string;
  primary_diagnosis?: string;
  secondary_diagnosis?: string;
  plan_of_care?: string;
}

interface PatientAllergy {
  id: string;
  allergy_name: string;
  severity?: string;
  reaction?: string;
}

interface EmergencyContact {
  id?: string;
  name: string;
  relationship?: string;
  home_phone?: string;
  work_phone?: string;
  cell_phone?: string;
  address?: string;
}

export default function PatientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);

      // Fetch patient data
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Fetch allergies
      const { data: allergiesData, error: allergiesError } = await supabase
        .from('patient_allergies')
        .select('*')
        .eq('patient_id', id);

      if (allergiesError) throw allergiesError;
      setAllergies(allergiesData || []);

      // Fetch emergency contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('patient_emergency_contacts')
        .select('*')
        .eq('patient_id', id);

      if (contactsError) throw contactsError;
      setEmergencyContacts(contactsData || []);

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

  const handlePatientChange = (field: keyof Patient, value: string) => {
    setPatient(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addAllergy = () => {
    setAllergies(prev => [...prev, { id: '', allergy_name: '', severity: '', reaction: '' }]);
  };

  const removeAllergy = (index: number) => {
    setAllergies(prev => prev.filter((_, i) => i !== index));
  };

  const updateAllergy = (index: number, field: keyof PatientAllergy, value: string) => {
    setAllergies(prev => prev.map((allergy, i) => 
      i === index ? { ...allergy, [field]: value } : allergy
    ));
  };

  const addEmergencyContact = () => {
    setEmergencyContacts(prev => [...prev, { 
      name: '', 
      relationship: '', 
      home_phone: '', 
      work_phone: '', 
      cell_phone: '', 
      address: '' 
    }]);
  };

  const removeEmergencyContact = (index: number) => {
    setEmergencyContacts(prev => prev.filter((_, i) => i !== index));
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    setEmergencyContacts(prev => prev.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    ));
  };

  const handleSave = async () => {
    if (!patient) return;

    try {
      setLoading(true);

      // Update patient data
      const { error: patientError } = await supabase
        .from('patients')
        .update({
          first_name: patient.first_name,
          last_name: patient.last_name,
          middle_name: patient.middle_name,
          date_of_birth: patient.date_of_birth,
          sex: patient.sex,
          race: patient.race,
          address: patient.address,
          phone: patient.phone,
          email: patient.email,
          emergency_contact_name: patient.emergency_contact_name,
          emergency_contact_phone: patient.emergency_contact_phone,
          care_level: patient.care_level,
          room_number: patient.room_number,
          status: patient.status,
          ssn: patient.ssn,
          referral_source: patient.referral_source,
          date_of_discharge: patient.date_of_discharge,
          primary_diagnosis: patient.primary_diagnosis,
          secondary_diagnosis: patient.secondary_diagnosis,
          plan_of_care: patient.plan_of_care,
        })
        .eq('id', id);

      if (patientError) throw patientError;

      // Delete existing allergies and create new ones
      await supabase.from('patient_allergies').delete().eq('patient_id', id);
      
      for (const allergy of allergies) {
        if (allergy.allergy_name.trim()) {
          await supabase.from('patient_allergies').insert({
            patient_id: id,
            allergy_name: allergy.allergy_name,
            severity: allergy.severity,
            reaction: allergy.reaction,
          });
        }
      }

      // Delete existing emergency contacts and create new ones
      await supabase.from('patient_emergency_contacts').delete().eq('patient_id', id);
      
      for (let i = 0; i < emergencyContacts.length; i++) {
        const contact = emergencyContacts[i];
        if (contact.name.trim()) {
          await supabase.from('patient_emergency_contacts').insert({
            patient_id: id,
            name: contact.name,
            relationship: contact.relationship,
            home_phone: contact.home_phone,
            work_phone: contact.work_phone,
            cell_phone: contact.cell_phone,
            address: contact.address,
            is_primary: i === 0,
          });
        }
      }

      toast({
        title: "Success",
        description: "Patient updated successfully",
      });

      navigate(`/patients/${id}`);

    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: "Failed to save patient",
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
            <div className="max-w-6xl mx-auto space-y-6">
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
                    <h1 className="text-2xl font-bold">Edit Patient</h1>
                    <p className="text-muted-foreground">
                      {patient.first_name} {patient.last_name}
                    </p>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList>
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="medical">Medical Information</TabsTrigger>
                  <TabsTrigger value="allergies">Allergies</TabsTrigger>
                  <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            value={patient.first_name}
                            onChange={(e) => handlePatientChange('first_name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="middle_name">Middle Name</Label>
                          <Input
                            id="middle_name"
                            value={patient.middle_name || ''}
                            onChange={(e) => handlePatientChange('middle_name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            value={patient.last_name}
                            onChange={(e) => handlePatientChange('last_name', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date_of_birth">Date of Birth</Label>
                          <Input
                            id="date_of_birth"
                            type="date"
                            value={patient.date_of_birth}
                            onChange={(e) => handlePatientChange('date_of_birth', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="sex">Sex</Label>
                          <Select
                            value={patient.sex || ''}
                            onValueChange={(value) => handlePatientChange('sex', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={patient.phone || ''}
                            onChange={(e) => handlePatientChange('phone', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={patient.email || ''}
                            onChange={(e) => handlePatientChange('email', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={patient.address || ''}
                          onChange={(e) => handlePatientChange('address', e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="room_number">Room Number</Label>
                          <Input
                            id="room_number"
                            value={patient.room_number || ''}
                            onChange={(e) => handlePatientChange('room_number', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={patient.status}
                            onValueChange={(value) => handlePatientChange('status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                              <SelectItem value="Discharged">Discharged</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Medical Information Tab */}
                <TabsContent value="medical">
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="primary_diagnosis">Primary Diagnosis</Label>
                          <Input
                            id="primary_diagnosis"
                            value={patient.primary_diagnosis || ''}
                            onChange={(e) => handlePatientChange('primary_diagnosis', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="secondary_diagnosis">Secondary Diagnosis</Label>
                          <Input
                            id="secondary_diagnosis"
                            value={patient.secondary_diagnosis || ''}
                            onChange={(e) => handlePatientChange('secondary_diagnosis', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="plan_of_care">Plan of Care</Label>
                        <Textarea
                          id="plan_of_care"
                          value={patient.plan_of_care || ''}
                          onChange={(e) => handlePatientChange('plan_of_care', e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="care_level">Care Level</Label>
                          <Input
                            id="care_level"
                            value={patient.care_level || ''}
                            onChange={(e) => handlePatientChange('care_level', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="referral_source">Referral Source</Label>
                          <Input
                            id="referral_source"
                            value={patient.referral_source || ''}
                            onChange={(e) => handlePatientChange('referral_source', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Allergies Tab */}
                <TabsContent value="allergies">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Allergies</CardTitle>
                        <Button onClick={addAllergy} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Allergy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {allergies.map((allergy, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Allergy {index + 1}</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAllergy(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Allergy Name</Label>
                              <Input
                                value={allergy.allergy_name}
                                onChange={(e) => updateAllergy(index, 'allergy_name', e.target.value)}
                                placeholder="e.g., Penicillin"
                              />
                            </div>
                            <div>
                              <Label>Severity</Label>
                              <Select
                                value={allergy.severity || ''}
                                onValueChange={(value) => updateAllergy(index, 'severity', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mild">Mild</SelectItem>
                                  <SelectItem value="moderate">Moderate</SelectItem>
                                  <SelectItem value="severe">Severe</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Reaction</Label>
                              <Input
                                value={allergy.reaction || ''}
                                onChange={(e) => updateAllergy(index, 'reaction', e.target.value)}
                                placeholder="e.g., Rash, difficulty breathing"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {allergies.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No allergies recorded. Click "Add Allergy" to add one.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Emergency Contacts Tab */}
                <TabsContent value="contacts">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Emergency Contacts</CardTitle>
                        <Button onClick={addEmergencyContact} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Contact
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {emergencyContacts.map((contact, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Contact {index + 1}</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEmergencyContact(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Name</Label>
                              <Input
                                value={contact.name}
                                onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                                placeholder="Contact name"
                              />
                            </div>
                            <div>
                              <Label>Relationship</Label>
                              <Input
                                value={contact.relationship || ''}
                                onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                                placeholder="e.g., Spouse, Child"
                              />
                            </div>
                            <div>
                              <Label>Home Phone</Label>
                              <Input
                                value={contact.home_phone || ''}
                                onChange={(e) => updateEmergencyContact(index, 'home_phone', e.target.value)}
                                placeholder="Home phone number"
                              />
                            </div>
                            <div>
                              <Label>Cell Phone</Label>
                              <Input
                                value={contact.cell_phone || ''}
                                onChange={(e) => updateEmergencyContact(index, 'cell_phone', e.target.value)}
                                placeholder="Cell phone number"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label>Address</Label>
                            <Textarea
                              value={contact.address || ''}
                              onChange={(e) => updateEmergencyContact(index, 'address', e.target.value)}
                              placeholder="Contact address"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                      
                      {emergencyContacts.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No emergency contacts recorded. Click "Add Contact" to add one.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}