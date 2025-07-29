import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, AlertTriangle, User, Calendar, Heart, CreditCard, FilePlus, Pencil, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PatientAssessments } from "@/components/assessments/patient-assessments";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  admission_date: string;
  room_number: string;
  care_level: string;
  status: string;
  profile_image_url?: string;
}

interface Allergy {
  id: string;
  allergy_name: string;
  severity: string;
  reaction: string;
  notes?: string;
}

interface Caregiver {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  specialization: string;
  phone: string;
  email: string;
  shift: string;
  profile_image_url?: string;
  is_primary: boolean;
}

interface MedicalRecord {
  id: string;
  record_type: string;
  title: string;
  description: string;
  recorded_by: string;
  recorded_date: string;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
}

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();
      if (patientError) throw patientError;
      setPatient(patientData);

      const { data: allergiesData, error: allergiesError } = await supabase
        .from("patient_allergies")
        .select("*")
        .eq("patient_id", id);
      if (allergiesError) throw allergiesError;
      setAllergies(allergiesData || []);

      const { data: caregiversData, error: caregiversError } = await supabase
        .from("patient_caregivers")
        .select(`
          is_primary,
          caregivers (
            id,
            first_name,
            last_name,
            role,
            specialization,
            phone,
            email,
            shift,
            profile_image_url
          )
        `)
        .eq("patient_id", id);
      if (caregiversError) throw caregiversError;

      const caregiversWithPrimary = caregiversData?.map(item => ({
        ...item.caregivers,
        is_primary: item.is_primary
      })) || [];
      setCaregivers(caregiversWithPrimary);

      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", id)
        .order("recorded_date", { ascending: false });
      if (recordsError) throw recordsError;
      setMedicalRecords(recordsData || []);

      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("patient_id", id)
        .order("date", { ascending: false });
      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);

    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getCareLevelColor = (level: string) => {
    switch (level) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Life-threatening": return "bg-red-100 text-red-800";
      case "Severe": return "bg-orange-100 text-orange-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "Mild": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading patient details...</div>
            </div>
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
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Patient not found</div>
            </div>
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
            <div className="max-w-none w-full space-y-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/patients">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Patients
                  </Link>
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={patient.profile_image_url} />
                      <AvatarFallback className="bg-gradient-teal text-white text-2xl">
                        {patient.first_name[0]}{patient.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h1 className="text-3xl font-bold text-foreground">
                            {patient.first_name} {patient.last_name}
                          </h1>
                          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {calculateAge(patient.date_of_birth)} years, {patient.gender}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Room {patient.room_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <Badge className={getCareLevelColor(patient.care_level)}>
                              {patient.care_level} Care
                            </Badge>
                            <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                              {patient.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <Button variant="default">
                              <FilePlus className="w-4 h-4 mr-1" /> Create Invoice
                            </Button>
                            <Button variant="outline">
                              <Pencil className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button variant="destructive">
                              <LogOut className="w-4 h-4 mr-1" /> Discharge
                            </Button>
                          </div>
                          <div className="flex flex-col text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {patient.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {patient.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {allergies.length > 0 && (
                    <Alert className="mt-6 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Allergies:</strong> {allergies.map(a => a.allergy_name).join(", ")}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
                  <TabsTrigger value="caregivers">Assigned Caregivers</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-5 gap-6">
                    {/* Personal Information (Left 60%) */}
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                          <p className="text-foreground">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Address</label>
                          <p className="text-foreground">{patient.address || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Admission Date</label>
                          <p className="text-foreground">{new Date(patient.admission_date).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contact Details (Right 40%) */}
                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle>Contact Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Emergency Contact Name</label>
                          <p className="text-foreground">{patient.emergency_contact_name || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Emergency Contact Phone</label>
                          <p className="text-foreground">{patient.emergency_contact_phone || "Not provided"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Allergies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Allergies & Reactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {allergies.length > 0 ? (
                        <div className="space-y-3">
                          {allergies.map((allergy) => (
                            <div key={allergy.id} className="p-3 border rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{allergy.allergy_name}</span>
                                    <Badge className={getSeverityColor(allergy.severity)}>
                                      {allergy.severity}
                                    </Badge>
                                  </div>
                                  {allergy.reaction && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Reaction: {allergy.reaction}
                                    </p>
                                  )}
                                  {allergy.notes && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Notes: {allergy.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No known allergies</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="medical-records">
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Records</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Recorded By</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {medicalRecords.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{new Date(record.recorded_date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{record.record_type}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{record.title}</TableCell>
                              <TableCell className="text-muted-foreground">{record.recorded_by}</TableCell>
                              <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {medicalRecords.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No medical records found.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="caregivers">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assigned Caregivers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {caregivers.length > 0 ? (
                        <div className="space-y-4">
                          {caregivers.map((caregiver) => (
                            <div key={caregiver.id} className="p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={caregiver.profile_image_url} />
                                  <AvatarFallback className="bg-gradient-secondary text-white">
                                    {caregiver.first_name[0]}{caregiver.last_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {caregiver.first_name} {caregiver.last_name}
                                    </span>
                                    {caregiver.is_primary && (
                                      <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {caregiver.role} - {caregiver.specialization}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{caregiver.shift} Shift</p>
                                </div>
                                <div className="text-right text-sm text-muted-foreground">
                                  <div>{caregiver.phone}</div>
                                  <div>{caregiver.email}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No caregivers assigned.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="assessments">
                  <PatientAssessments patientId={id!} />
                </TabsContent>

                <TabsContent value="billing">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Billing & Payments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {payments.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Method</TableHead>
                              <TableHead>Reference</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {payments.map(payment => (
                              <TableRow key={payment.id}>
                                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                <TableCell>{payment.method}</TableCell>
                                <TableCell>{payment.reference}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground">No payment records available.</p>
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
