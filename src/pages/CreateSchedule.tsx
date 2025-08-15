import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
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
}

export default function CreateSchedule(): JSX.Element {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchStaff();
    fetchPatients();
  }, []);

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from("staff")
      .select("id, first_name, last_name, role")
      .order("last_name");

    if (error) {
      console.error("Error fetching staff:", error);
      return;
    }
    setStaffList(data || []);
  };

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from("patients")
      .select("id, first_name, last_name")
      .order("first_name");

    if (error) {
      console.error("Error fetching patients:", error);
      return;
    }
    setPatients(data || []);
  };

  const handleCreate = async () => {
    if (!selectedStaff || !startTime || !endTime) {
      alert("Please fill all required fields.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from("availabilities").insert([
        {
          staff_id: selectedStaff,
          patient_id: selectedPatient === "unassigned" ? null : selectedPatient || null,
          start_time: startTime,
          end_time: endTime,
          status: selectedPatient && selectedPatient !== "unassigned" ? "Booked" : "Available",
        },
      ]);

      if (error) {
        console.error("Error creating schedule:", error);
        alert("Failed to create schedule.");
        return;
      }

      navigate("/schedule");
    } catch (error) {
      console.error("Error creating schedule:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="max-w-none w-full space-y-6 md:space-y-8">
              {/* Back Button */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/schedule">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Schedule
                  </Link>
                </Button>
              </div>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">Create Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
                  {/* Staff Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="staff">Staff Member</Label>
                    <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                      {staffList.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.first_name} {staff.last_name} ({staff.role})
                        </SelectItem>
                      ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Patient Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="patient">Assign Patient (Optional)</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Start Time */}
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  {/* End Time */}
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>

                  {/* Create Button */}
                  <Button
                    className="w-full bg-gradient-primary text-white hover:opacity-90"
                    onClick={handleCreate}
                    disabled={saving}
                  >
                    {saving ? "Creating..." : "Create Schedule"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
