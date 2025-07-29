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
  patient_allergies: Array<{
    allergy_name: string;
    severity: string;
  }>;
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
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [schedule, setSchedule] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchedule();
    fetchStaff();
    fetchPatients();
  }, []);

  const fetchSchedule = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from("availabilities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setSchedule(data);
      setSelectedStaff(data.staff_id);
      setSelectedPatient(data.patient_id || "");
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("id, first_name, last_name, role")
        .order("last_name");

      if (error) throw error;
      setStaffList(data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select(`
          id,
          first_name,
          last_name,
          patient_allergies (allergy_name, severity)
        `)
        .order("last_name");

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleSave = async () => {
    if (!schedule || !id) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("availabilities")
        .update({
          patient_id: selectedPatient || null,
          status: selectedPatient ? "Booked" : "Available"
        })
        .eq("id", id);

      if (error) throw error;
      navigate("/schedule");
    } catch (error) {
      console.error("Error updating schedule:", error);
    } finally {
      setSaving(false);
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  };

  // Fixed loading state with proper JSX formatting
  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading schedule details...
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="p-8 text-center">
        Schedule not found
      </div>
    );
  }

  const selectedPatientData = patients.find(p => p.id === selectedPatient);
  const selectedStaffData = staffList.find(s => s.id === selectedStaff);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Schedule Details</h1>
        <Button variant="outline" onClick={() => navigate("/schedule")}>
          Back to Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="staff">Staff Member</Label>
              <Select 
                value={selectedStaff} 
                onValueChange={setSelectedStaff}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.first_name} {staff.last_name} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient">Assign Patient</Label>
              <Select 
                value={selectedPatient} 
                onValueChange={setSelectedPatient}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassign</SelectItem>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPatientData && (
              <div className="space-y-2">
                <Label>Patient Allergies</Label>
                <div className="border rounded-lg p-4">
                  {selectedPatientData.patient_allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedPatientData.patient_allergies.map((allergy, index) => (
                        <Badge 
                          key={index}
                          className={`text-xs ${getSeverityColor(allergy.severity)}`}
                        >
                          {allergy.allergy_name} ({allergy.severity})
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
                <h3 className="font-medium text-foreground">
                  {selectedStaffData ? 
                    `${selectedStaffData.first_name} ${selectedStaffData.last_name}` : 
                    'Staff Member'}
                </h3>
                <p className="text-muted-foreground">
                  {selectedStaffData?.role || 'Role not specified'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time Slot</Label>
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <p className="font-medium">
                      {calculateDuration(schedule.start_time, schedule.end_time)} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge 
                      className={selectedPatient ? 
                        "bg-blue-100 text-blue-800" : 
                        "bg-green-100 text-green-800"
                      }
                    >
                      {selectedPatient ? "Booked" : "Available"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {selectedPatientData && (
              <div className="space-y-2">
                <Label>Assigned Patient</Label>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-3 rounded-full">
                      <div className="bg-gradient-teal text-white rounded-full w-8 h-8 flex items-center justify-center">
                        {selectedPatientData.first_name[0]}{selectedPatientData.last_name[0]}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {selectedPatientData.first_name} {selectedPatientData.last_name}
                      </h3>
                      <p className="text-muted-foreground">
                        ID: {selectedPatientData.id.slice(0, 8)}...
                      </p>
                    </div>
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
