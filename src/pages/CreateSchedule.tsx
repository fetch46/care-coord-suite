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

export default function CreateSchedule(): JSX.Element {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async (): Promise<void> => {
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

  const handleCreate = async (): Promise<void> => {
    if (!selectedStaff || !startTime || !endTime) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("availabilities")
        .insert([
          {
            staff_id: selectedStaff,
            start_time: startTime,
            end_time: endTime,
            status: "Available",
          },
        ]);

      if (error) throw error;

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
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Header with back button */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/schedule">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Schedule
                  </Link>
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Create Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  <div className="space-y-2">
                    <Label htmlFor="start">Start Time</Label>
                    <Input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end">End Time</Label>
                    <Input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>

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

