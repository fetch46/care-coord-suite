import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, AlertTriangle, User, Calendar, Heart, MoreVertical, FilePlus } from "lucide-react";
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
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

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
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

      const caregiversWithPrimary =
        caregiversData?.map((item) => ({
          ...item.caregivers,
          is_primary: item.is_primary,
        })) || [];
      setCaregivers(caregiversWithPrimary);

      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", id)
        .order("recorded_date", { ascending: false });

      if (recordsError) throw recordsError;
      setMedicalRecords(recordsData || []);
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
              {/* Header */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/patients">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Patients
                  </Link>
                </Button>
              </div>

              {/* Patient Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={patient.profile_image_url} />
                        <AvatarFallback className="bg-gradient-teal text-white text-2xl">
                          {patient.first_name[0]}{patient.last_name[0]}
                        </AvatarFallback>
                      </Avatar>

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
                    </div>

                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Discharge Patient</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Allergies Alert */}
                  {allergies.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                      <Alert className="border-red-200 bg-red-50 w-auto flex-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <strong>Allergies:</strong> {allergies.map((a) => a.allergy_name).join(", ")}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
                  <TabsTrigger value="caregivers">Assigned Caregivers</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Personal Info */}
                  {/* ... same as before */}
                </TabsContent>

                {/* Medical Records */}
                <TabsContent value="medical-records">
                  {/* ... same as before */}
                </TabsContent>

                {/* Caregivers */}
                <TabsContent value="caregivers">
                  {/* ... same as before */}
                </TabsContent>

                {/* Assessments */}
                <TabsContent value="assessments">
                  <PatientAssessments patientId={id!} />
                </TabsContent>

                {/* Billing */}
                <TabsContent value="billing">
                  <Card>
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle>Billing</CardTitle>
                      <Button className="bg-gradient-primary text-white hover:opacity-90 flex items-center gap-2">
                        <FilePlus className="w-4 h-4" />
                        Create Invoice
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Billing details and invoices will appear here.
                      </p>
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
