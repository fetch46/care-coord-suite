import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  patient_allergies: {
    allergy_name: string;
    severity: string;
  }[];
}

interface Availability {
  id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  status: "Available" | "Booked" | "On Leave";
  patient_id?: string;
}

export default function ScheduleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [schedule, setSchedule] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchSchedule(), fetchStaff(), fetchPatients()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchSchedule = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from("availabilities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching schedule:", error);
      return;
    }

    setSchedule(data);
    setSelectedStaff(data.staff_id);
    setSelectedPatient(data.patient_id || "");
  };

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from("staff")
      .select("id, first_name, last_name, role")
      .order("last_name");

    if (error) console.error("Error fetching staff:", error);
    else setStaffList(data || []);
  };

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from("patients")
      .select("id, first_name, last_name, patient_allergies (allergy_name, severity)")
      .order("last_name");

    if (error) console.error("Error fetching patients:", error);
    else setPatients(data || []);
  };

  const handleSave = async () => {
    if (!schedule || !id) return;
    setSaving(true);

    const { error } = await supabase
      .from("availabilities")
      .update({
        patient_id: selectedPatient || null,
        status: selectedPatient ? "Booked" : "Available"
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      console.error("Error updating schedule:", error);
    } else {
      navigate("/schedule");
    }
  };

  const getSeverityColor = (severity: string) => {
    const map: Record<string, string> = {
      "Life-threatening": "bg-red-100 text-red-800",
      Severe: "bg-orange-100 text-orange-800",
      Moderate: "bg-yellow-100 text-yellow-800",
      Mild: "bg-green-100 text-green-800",
    };
    return map[severity] || "bg-gray-100 text-gray-800";
  };

  const formatDateTime = (str: string) =>
    new Date(str).toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const calculateDuration = (start: string, end: string) =>
    Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);

  const selectedPatientData = patients.find(p => p.id === selectedPatient);
  const selectedStaffData = staffList.find(s => s.id === selectedStaff);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-lg">Loading Schedule details...</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!schedule) {
    return <div className="p-8 text-center text-muted-foreground">Schedule not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Schedule Details</h1>
        <Button variant="outline" onClick={() => navigate("/schedule")}>
          Back to Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Staff Select */}
            <div className="space-y-2">
              <Label htmlFor="staff">Staff Member</Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} ({s.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Patient Select */}
            <div className="space-y-2">
              <Label htmlFor="patient">Assign Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassign</SelectItem>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.first_name} {p.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Allergy Info */}
            {selectedPatientData && (
              <div className="space-y-2">
                <Label>Patient Allergies</Label>
                <div className="border rounded-lg p-4">
                  {selectedPatientData.patient_allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedPatientData.patient_allergies.map((a, i) => (
                        <Badge key={i} className={`text-xs ${getSeverityColor(a.severity)}`}>
                          {a.allergy_name} ({a.severity})
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No allergies recorded</p>
                  )}
                </div>
              </div>
            )}

            <Button
              className="w-full bg-gradient-primary text-white hover:opacity-90"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Assignment"}
            </Button>
          </CardContent>
        </Card>

        {/* Right Card */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="text-blue-800 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">
                  {selectedStaffData ? `${selectedStaffData.first_name} ${selectedStaffData.last_name}` : "Staff Member"}
                </h3>
                <p className="text-muted-foreground">
                  {selectedStaffData?.role || "Role not specified"}
                </p>
              </div>
            </div>

            {/* Slot Info */}
            <div className="space-y-2">
              <Label>Time Slot</Label>
              <div className="border rounded-lg p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start</p>
                  <p className="font-medium">{formatDateTime(schedule.start_time)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End</p>
                  <p className="font-medium">{formatDateTime(schedule.end_time)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{calculateDuration(schedule.start_time, schedule.end_time)} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      selectedPatient ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }
                  >
                    {selectedPatient ? "Booked" : "Available"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            {selectedPatientData && (
              <div className="space-y-2">
                <Label>Assigned Patient</Label>
                <div className="border rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <div className="bg-gradient-teal text-white rounded-full w-8 h-8 flex items-center justify-center">
                      {selectedPatientData.first_name[0]}{selectedPatientData.last_name[0]}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {selectedPatientData.first_name} {selectedPatientData.last_name}
                    </h3>
                    <p className="text-muted-foreground">ID: {selectedPatientData.id.slice(0, 8)}...</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
