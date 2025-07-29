"use client";

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
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PatientAssessments } from "@/components/patients/patient-assessments";

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchData = async () => {
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      const { data: medicalData } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", id)
        .order("recorded_date", { ascending: false });

      const { data: caregiverData } = await supabase
        .from("assigned_caregivers")
        .select("*")
        .eq("patient_id", id);

      if (patientError) {
        console.error(patientError);
      } else {
        setPatient(patientData);
        setMedicalRecords(medicalData || []);
        setCaregivers(caregiverData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading patient details...</div>;
  }

  if (!patient) {
    return (
      <div className="p-8 text-center text-red-500">
        Patient not found or error loading data.
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <AppHeader />
        <SidebarInset>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
            <div className="flex items-center justify-between">
              <Link
                to="/patients"
                className="flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Patients
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={patient.photo_url} />
                    <AvatarFallback className="bg-muted text-white">
                      {patient.first_name[0]}
                      {patient.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-lg">
                      {patient.first_name} {patient.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {patient.patient_id} - {patient.gender} -{" "}
                      {new Date(patient.date_of_birth).toLocaleDateString()}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <Phone className="inline w-4 h-4 mr-2" />
                      {patient.phone}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      {patient.email}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <User className="inline w-4 h-4 mr-2" />
                      Next of Kin: {patient.next_of_kin}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      Admission Date:{" "}
                      {new Date(patient.admission_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <Heart className="inline w-4 h-4 mr-2" />
                      Status:{" "}
                      <Badge variant="outline">{patient.status}</Badge>
                    </p>
                    {patient.alert && (
                      <p className="text-sm text-red-500 mt-2">
                        <AlertTriangle className="inline w-4 h-4 mr-2" />
                        Alert: {patient.alert}
                      </p>
                    )}
                  </div>
                </div>
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
                {/* Add any overview widgets here if needed */}
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
                            <TableCell>
                              {new Date(record.recorded_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{record.record_type}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{record.title}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {record.recorded_by}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {record.description}
                            </TableCell>
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
                                  {caregiver.first_name[0]}
                                  {caregiver.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {caregiver.first_name} {caregiver.last_name}
                                  {caregiver.is_primary && (
                                    <Badge className="ml-2" variant="secondary">
                                      Primary
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {caregiver.role} - {caregiver.specialization}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {caregiver.phone} | {caregiver.email}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Shift: {caregiver.shift}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No caregivers assigned</p>
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
                    <CardTitle>Billing & Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Billing section coming soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
