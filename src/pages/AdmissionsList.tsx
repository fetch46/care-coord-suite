import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Bed, Calendar, User, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Admission {
  id: string;
  patient_id: string;
  room_id: string;
  admission_date: string;
  admission_type: string;
  admission_status: string;
  attending_physician: string;
  care_level: string;
  patients?: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
  } | null;
  rooms?: {
    room_number: string;
    room_type: string;
  } | null;
}

export default function AdmissionsList() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      // Fetch admissions without joins (no FK relationships defined)
      const { data: admissionsData, error: admissionsError } = await supabase
        .from("admissions")
        .select("*")
        .order("admission_date", { ascending: false });

      if (admissionsError) throw admissionsError;
      const admissions = admissionsData || [];

      // Collect unique patient and room IDs
      const patientIds = Array.from(new Set(admissions.map((a: any) => a.patient_id).filter(Boolean)));
      const roomIds = Array.from(new Set(admissions.map((a: any) => a.room_id).filter(Boolean)));

      // Fetch related patients and rooms in parallel
      const [patientsRes, roomsRes] = await Promise.all([
        patientIds.length
          ? supabase.from("patients").select("id, first_name, last_name, date_of_birth").in("id", patientIds)
          : Promise.resolve({ data: [], error: null }),
        roomIds.length
          ? supabase.from("rooms").select("id, room_number, room_type").in("id", roomIds)
          : Promise.resolve({ data: [], error: null })
      ]);

      if (patientsRes.error) throw patientsRes.error;
      if (roomsRes.error) throw roomsRes.error;

      const patientsMap = new Map((patientsRes.data || []).map((p: any) => [p.id, p]));
      const roomsMap = new Map((roomsRes.data || []).map((r: any) => [r.id, r]));

      const enriched = admissions.map((a: any) => ({
        ...a,
        patients: patientsMap.get(a.patient_id) || null,
        rooms: roomsMap.get(a.room_id) || null,
      }));

      setAdmissions(enriched);
    } catch (error) {
      console.error("Error fetching admissions:", error);
      toast({
        title: "Error",
        description: "Failed to load admissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "admitted":
        return "bg-blue-100 text-blue-800";
      case "discharged":
        return "bg-gray-100 text-gray-800";
      case "transferred":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "transfer":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading admissions...</p>
                </div>
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
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="max-w-none w-full space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bed className="w-6 h-6 text-primary" />
                  <h1 className="text-3xl font-bold">Admissions</h1>
                </div>
                <Button onClick={() => navigate("/patient-admission")}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  New Admission
                </Button>
              </div>

              {admissions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Bed className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No admissions found</h3>
                    <p className="text-muted-foreground mb-4">
                      Get started by admitting your first patient.
                    </p>
                    <Button onClick={() => navigate("/patient-admission")}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Admit Patient
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {admissions.map((admission) => (
                    <Card key={admission.id} className="w-full hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">
                              {admission.patients?.last_name || 'Unknown'}, {admission.patients?.first_name || 'Patient'}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>DOB: {admission.patients?.date_of_birth ? new Date(admission.patients.date_of_birth).toLocaleDateString() : 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Admitted: {new Date(admission.admission_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getStatusColor(admission.admission_status)}>
                              {admission.admission_status}
                            </Badge>
                            <Badge className={getTypeColor(admission.admission_type)}>
                              {admission.admission_type}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Room {admission.rooms?.room_number || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground">{admission.rooms?.room_type || 'N/A'}</p>
                            </div>
                          </div>
                          
                          {admission.care_level && (
                            <div>
                              <p className="text-sm font-medium">Care Level</p>
                              <Badge variant="secondary" className="text-xs">
                                {admission.care_level}
                              </Badge>
                            </div>
                          )}

                          {admission.attending_physician && (
                            <div>
                              <p className="text-sm font-medium">Attending Physician</p>
                              <p className="text-sm text-muted-foreground">{admission.attending_physician}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => navigate(`/patients/${admission.patient_id}`)}
                          >
                            View Patient
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/patients/${admission.patient_id}/edit`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}