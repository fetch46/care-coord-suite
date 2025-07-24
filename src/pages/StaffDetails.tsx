import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Clock, MapPin, Calendar, User, FileText, Users } from "lucide-react";
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

interface Caregiver {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  specialization: string;
  shift: string;
  status: string;
  phone: string;
  email: string;
  profile_image_url?: string;
  created_at: string;
}

interface PatientAssignment {
  id: string;
  patient_id: string;
  assignment_date: string;
  is_primary: boolean;
  notes?: string;
  patients: {
    first_name: string;
    last_name: string;
    room_number: string;
    care_level: string;
  };
}

export default function StaffDetails() {
  const { id } = useParams();
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [assignments, setAssignments] = useState<PatientAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCaregiverDetails();
      fetchPatientAssignments();
    }
  }, [id]);

  const fetchCaregiverDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("caregivers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setCaregiver(data);
    } catch (error) {
      console.error("Error fetching caregiver details:", error);
    }
  };

  const fetchPatientAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from("patient_caregivers")
        .select(`
          *,
          patients (
            first_name,
            last_name,
            room_number,
            care_level
          )
        `)
        .eq("caregiver_id", id)
        .order("assignment_date", { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error("Error fetching patient assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Doctor": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Nurse": return "bg-green-100 text-green-800 border-green-200";
      case "Therapist": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Administrator": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "Day": return "bg-yellow-100 text-yellow-800";
      case "Night": return "bg-indigo-100 text-indigo-800";
      case "Rotating": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <SidebarInset className="w-full">
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading staff details...</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!caregiver) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <SidebarInset className="w-full">
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Staff member not found</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="w-full">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-none w-full space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Link to="/staff">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Staff
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {caregiver.first_name} {caregiver.last_name}
                  </h1>
                  <p className="text-muted-foreground mt-1">Staff member details</p>
                </div>
              </div>

              {/* Staff Overview Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={caregiver.profile_image_url} />
                        <AvatarFallback className="bg-gradient-teal text-white text-2xl">
                          {caregiver.first_name[0]}{caregiver.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {caregiver.first_name} {caregiver.last_name}
                        </h2>
                        <Badge className={getRoleColor(caregiver.role)}>
                          {caregiver.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Specialization</p>
                            <p className="font-medium">{caregiver.specialization || "General"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Shift</p>
                            <Badge variant="secondary" className={getShiftColor(caregiver.shift)}>
                              {caregiver.shift} Shift
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-medium">
                              {new Date(caregiver.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{caregiver.phone || "Not provided"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{caregiver.email || "Not provided"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge 
                              variant={caregiver.status === "Active" ? "default" : "secondary"}
                              className={caregiver.status === "Active" ? "bg-green-100 text-green-800" : ""}
                            >
                              {caregiver.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="assignments" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="assignments">Patient Assignments</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="assignments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Current Patient Assignments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assignments.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient Name</TableHead>
                              <TableHead>Room</TableHead>
                              <TableHead>Care Level</TableHead>
                              <TableHead>Assignment Date</TableHead>
                              <TableHead>Primary</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {assignments.map((assignment) => (
                              <TableRow key={assignment.id}>
                                <TableCell className="font-medium">
                                  <Link 
                                    to={`/patients/${assignment.patient_id}`}
                                    className="text-primary hover:underline"
                                  >
                                    {assignment.patients.first_name} {assignment.patients.last_name}
                                  </Link>
                                </TableCell>
                                <TableCell>{assignment.patients.room_number || "N/A"}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {assignment.patients.care_level || "Standard"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(assignment.assignment_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {assignment.is_primary ? (
                                    <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                                  ) : (
                                    <Badge variant="secondary">Assistant</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  {assignment.notes || "No notes"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No patient assignments found
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Work Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        Schedule management coming soon
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        Performance tracking coming soon
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