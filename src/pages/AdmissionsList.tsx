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
  patients: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
  };
  rooms: {
    room_number: string;
    room_type: string;
  };
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
      const { data, error } = await supabase
        .from("admissions")
        .select(`
          *,
          patients (first_name, last_name, date_of_birth),
          rooms (room_number, room_type)
        `)
        .order("admission_date", { ascending: false });

      if (error) throw error;
      if (data) setAdmissions(data);
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
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {admissions.map((admission) => (
                    <Card key={admission.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {admission.patients.last_name}, {admission.patients.first_name}
                          </CardTitle>
                          <Badge className={getStatusColor(admission.admission_status)}>
                            {admission.admission_status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>DOB: {new Date(admission.patients.date_of_birth).toLocaleDateString()}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Room {admission.rooms.room_number}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {admission.rooms.room_type}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            Admitted: {new Date(admission.admission_date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge className={getTypeColor(admission.admission_type)}>
                            {admission.admission_type}
                          </Badge>
                          {admission.care_level && (
                            <Badge variant="secondary" className="text-xs">
                              {admission.care_level}
                            </Badge>
                          )}
                        </div>

                        {admission.attending_physician && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Attending:</strong> {admission.attending_physician}
                          </div>
                        )}

                        <div className="pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate(`/patients/${admission.patient_id}`)}
                          >
                            View Patient
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