import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ChevronLeft, Calendar, Clock, User } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_image_url?: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface Availability {
  id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  status: "Available" | "Booked" | "On Leave";
  patient_id?: string;
  staff: Staff;
  patient?: Patient;
}

export default function ScheduleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Dummy staff & patients
  const staffList: Staff[] = [
    { id: "s1", first_name: "John", last_name: "Doe", role: "Nurse" },
    { id: "s2", first_name: "Emily", last_name: "Smith", role: "Doctor" },
    { id: "s3", first_name: "Sarah", last_name: "Brown", role: "Therapist" },
  ];

  const patientList: Patient[] = [
    { id: "p1", first_name: "Michael", last_name: "Johnson" },
    { id: "p2", first_name: "Laura", last_name: "White" },
  ];

  // Dummy schedule data
  const now = new Date();
  const scheduleData: Availability[] = [
    {
      id: "1",
      staff_id: "s1",
      start_time: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: "Available",
      staff: staffList[0],
    },
    {
      id: "2",
      staff_id: "s2",
      start_time: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      status: "Booked",
      staff: staffList[1],
      patient: patientList[0],
    },
  ];

  const schedule = useMemo(() => scheduleData.find((item) => item.id === id), [id]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(schedule?.staff_id || "");
  const [selectedPatient, setSelectedPatient] = useState(schedule?.patient?.id || "");
  const [selectedStatus, setSelectedStatus] = useState(schedule?.status || "Available");

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const statusColorMap: Record<string, string> = {
    Available: "bg-green-100 text-green-800 border-green-200",
    Booked: "bg-blue-100 text-blue-800 border-blue-200",
    "On Leave": "bg-gray-100 text-gray-800 border-gray-200",
  };

  if (!schedule) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium">Schedule not found.</p>
                <Button asChild className="mt-4">
                  <Link to="/schedule">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to Schedule
                  </Link>
                </Button>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  const duration = Math.round(
    (new Date(schedule.end_time).getTime() - new Date(schedule.start_time).getTime()) / (1000 * 60)
  );

  const handleSave = () => {
    console.log("Saved changes:", { selectedStaff, selectedPatient, selectedStatus });
    setIsEditing(false);
  };

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
      setSelectedStaff(schedule.staff_id);
      setSelectedPatient(schedule.patient?.id || "");
      setSelectedStatus(schedule.status);
    } else {
      navigate("/schedule");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Back Button */}
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" /> {isEditing ? "Cancel" : "Back to Schedule"}
            </Button>

            {/* Schedule Details */}
            <Card className="shadow-lg border">
              <CardHeader className="pb-4 border-b flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold">Schedule Details</CardTitle>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Staff Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border">
                    <AvatarImage
                      src={schedule.staff.profile_image_url || "/default-avatar.png"}
                      alt={`${schedule.staff.first_name} ${schedule.staff.last_name}`}
                    />
                    <AvatarFallback>
                      {schedule.staff.first_name[0]}
                      {schedule.staff.last_name[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    {isEditing ? (
                      <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select staff" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffList.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.first_name} {staff.last_name} ({staff.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <>
                        <p className="text-lg font-semibold">
                          {schedule.staff.first_name} {schedule.staff.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{schedule.staff.role}</p>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Time & Duration */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start</p>
                      <p className="font-medium">{formatDateTime(schedule.start_time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">End</p>
                      <p className="font-medium">{formatDateTime(schedule.end_time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <Select value={selectedStatus} onValueChange={(value: "Available" | "Booked" | "On Leave") => setSelectedStatus(value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Booked">Booked</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={statusColorMap[schedule.status]}>{schedule.status}</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Patient Info */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <User className="w-4 h-4" /> Assigned Patient
                  </p>
                  {isEditing ? (
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Assign a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {patientList.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : schedule.patient ? (
                    <p className="font-medium">
                      {schedule.patient.first_name} {schedule.patient.last_name}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">No patient assigned</p>
                  )}
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end">
                    <Button className="bg-gradient-primary text-white hover:opacity-90" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
