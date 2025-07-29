import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, AlertTriangle, User, Calendar, Heart, CreditCard } from "lucide-react";
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
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {patient.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="default">Create Invoice</Button>
                        <Button variant="outline">Edit</Button>
                        <Button variant="destructive">Discharge</Button>
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
                  {/* Overview Tab */}
                  ...
                </TabsContent>

                <TabsContent value="medical-records">
                  {/* Medical Records Tab */}
                  ...
                </TabsContent>

                <TabsContent value="caregivers">
                  {/* Caregivers Tab */}
                  ...
                </TabsContent>

                <TabsContent value="assessments">
                  <PatientAssessments patientId={id!} />
                </TabsContent>

                <TabsContent value="billing">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Billing Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
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
                          {payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                              <TableCell>${payment.amount.toFixed(2)}</TableCell>
                              <TableCell>{payment.method}</TableCell>
                              <TableCell>{payment.reference}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {payments.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No payments recorded.
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
