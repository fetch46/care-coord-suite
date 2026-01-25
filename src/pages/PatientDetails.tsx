import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  AlertTriangle,
  User,
  Calendar,
  Heart,
  FilePlus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      // Fetch patient details
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Fetch allergies
      const { data: allergiesData, error: allergiesError } = await supabase
        .from("patient_allergies")
        .select("*")
        .eq("patient_id", id);

      if (allergiesError) throw allergiesError;
      setAllergies(allergiesData || []);

      // Fetch caregivers - use staff table instead of caregivers
      const { data: caregiversData, error: caregiversError } = await supabase
        .from("patient_caregivers")
        .select(`
          is_primary,
          staff:caregiver_id (
            id,
            first_name,
            last_name,
            role,
            phone,
            email
          )
        `)
        .eq("patient_id", id);

      if (caregiversError) throw caregiversError;

      const caregiversWithPrimary =
        caregiversData?.map((item: any) => ({
          ...(item.staff || {}),
          is_primary: item.is_primary,
        })).filter((item: any) => item.id) || [];
      setCaregivers(caregiversWithPrimary);

      // Fetch medical records
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
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getCareLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Life-threatening":
        return "bg-red-100 text-red-800";
      case "Severe":
        return "bg-orange-100 text-orange-800";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800";
      case "Mild":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  // Calculate truncated allergies list
  const displayedAllergies = allergies.slice(0, 3);
  const additionalCount = allergies.length > 3 ? allergies.length - 3 : 0;

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

              {/* Patient Header Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={patient.profile_image_url} />
                      <AvatarFallback className="bg-gradient-teal text-white text-2xl">
                        {patient.first_name[0]}
                        {patient.last_name[0]}
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
                              {calculateAge(patient.date_of_birth)} years,{" "}
                              {patient.gender}
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
                            <Badge
                              variant={patient.status === "Active" ? "default" : "secondary"}
                            >
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
                          
                          {/* Action Buttons with increased top margin */}
                          <div className="flex gap-2 mt-10 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-blue-500 text-blue-500 hover:bg-blue-50"
                              asChild
                            >
                              <Link to={`/patients/${id}/edit`}>
                                Edit Patient
                              </Link>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50"
                              asChild
                            >
                              <Link to={`/patients/${id}/discharge`}>
                                Discharge Patient
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Allergies Alert */}
                  {allergies.length > 0 && (
                    <Alert variant="destructive" className="mt-6">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Allergies:</strong>
                        {" "}
                        {displayedAllergies.map((a) => a.allergy_name).join(", ")}
                        {additionalCount > 0 && (
                          <span className="font-medium">
                            {" "}+{additionalCount} more
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
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

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Date of Birth
                          </label>
                          <p className="text-foreground">
                            {new Date(patient.date_of_birth).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Address
                          </label>
                          <p className="text-foreground">
                            {patient.address || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Admission Date
                          </label>
                          <p className="text-foreground">
                            {new Date(patient.admission_date).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Emergency Contact */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Emergency Contact</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Name
                          </label>
                          <p className="text-foreground">
                            {patient.emergency_contact_name || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Phone
                          </label>
                          <p className="text-foreground">
                            {patient.emergency_contact_phone || "Not provided"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Allergies */}
                    <Card className="md:col-span-2">
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
                              <div
                                key={allergy.id}
                                className="p-3 border rounded-lg"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {allergy.allergy_name}
                                      </span>
                                      <Badge
                                        className={getSeverityColor(
                                          allergy.severity
                                        )}
                                      >
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
                          <p className="text-muted-foreground">
                            No known allergies
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="medical-records">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Medical Records</CardTitle>
                      <Button 
                        className="bg-gradient-primary text-white hover:opacity-90"
                        asChild
                      >
                        <Link to={`/medical-records/new?patient_id=${id}`}>
                          <FilePlus className="w-4 h-4 mr-2" />
                          Add Record
                        </Link>
                      </Button>
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
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {medicalRecords.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>
                                {new Date(record.recorded_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{record.record_type}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {record.title}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {record.recorded_by}
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {record.description}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link to={`/medical-records/${record.id}`}>
                                      View
                                    </Link>
                                  </Button>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link to={`/medical-records/${record.id}/edit`}>
                                      Edit
                                    </Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {medicalRecords.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No medical records found.</p>
                          <Button 
                            className="mt-4 bg-gradient-primary text-white hover:opacity-90"
                            asChild
                          >
                            <Link to={`/medical-records/new?patient_id=${id}`}>
                              <FilePlus className="w-4 h-4 mr-2" />
                              Add First Medical Record
                            </Link>
                          </Button>
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
                            <div
                              key={caregiver.id}
                              className="p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage
                                    src={caregiver.profile_image_url}
                                  />
                                  <AvatarFallback className="bg-gradient-secondary text-white">
                                    {caregiver.first_name[0]}
                                    {caregiver.last_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {caregiver.first_name} {caregiver.last_name}
                                    </span>
                                    {caregiver.is_primary && (
                                      <Badge className="bg-blue-100 text-blue-800">
                                        Primary
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {caregiver.role} - {caregiver.specialization}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {caregiver.shift} Shift
                                  </p>
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
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Billing & Invoices</CardTitle>
                      <Button className="bg-gradient-primary text-white hover:opacity-90 flex items-center gap-2" asChild>
                        <Link to={`/billing/invoice/new?patient_id=${id}`}>
                          <FilePlus className="w-4 h-4" />
                          Create Invoice
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Recent Invoices Table */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Invoice Number</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {/* Mock invoice data - replace with real data */}
                              <TableRow>
                                <TableCell className="font-medium">INV-001</TableCell>
                                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                                <TableCell>$1,250.00</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm">View</Button>
                                    <Button variant="ghost" size="sm">Download</Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">INV-002</TableCell>
                                <TableCell>{new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                                <TableCell>$750.00</TableCell>
                                <TableCell>
                                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm">View</Button>
                                    <Button variant="ghost" size="sm">Send Reminder</Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        
                        {/* Billing Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground">Total Billed</div>
                              <div className="text-2xl font-bold">$2,000.00</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground">Amount Paid</div>
                              <div className="text-2xl font-bold text-green-600">$1,250.00</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground">Outstanding</div>
                              <div className="text-2xl font-bold text-orange-600">$750.00</div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
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
