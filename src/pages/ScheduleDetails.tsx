import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { ChevronLeft, Calendar, Clock, User } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  // Dummy schedule data
  const now = new Date();
  const scheduleData: Availability[] = [
    {
      id: "1",
      staff_id: "s1",
      start_time: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: "Available",
      staff: { id: "s1", first_name: "John", last_name: "Doe", role: "Nurse", profile_image_url: "" },
    },
    {
      id: "2",
      staff_id: "s2",
      start_time: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      status: "Booked",
      staff: { id: "s2", first_name: "Emily", last_name: "Smith", role: "Doctor", profile_image_url: "" },
      patient: { id: "p1", first_name: "Michael", last_name: "Johnson" },
    },
    {
      id: "3",
      staff_id: "s3",
      start_time: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      status: "On Leave",
      staff: { id: "s3", first_name: "Sarah", last_name: "Brown", role: "Therapist", profile_image_url: "" },
    },
  ];

  const schedule = useMemo(() => scheduleData.find((item) => item.id === id), [id]);

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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Back Button */}
            <Button variant="ghost" asChild className="flex items-center gap-2">
              <Link to="/schedule">
                <ChevronLeft className="w-4 h-4" /> Back to Schedule
              </Link>
            </Button>

            {/* Schedule Details Card */}
            <Card className="shadow-lg border">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-2xl font-semibold">Schedule Details</CardTitle>
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
                    <p className="text-lg font-semibold">
                      {schedule.staff.first_name} {schedule.staff.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{schedule.staff.role}</p>
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
                    <Badge className={statusColorMap[schedule.status]}>{schedule.status}</Badge>
                  </div>
                </div>

                <Separator />

                {/* Patient Info */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <User className="w-4 h-4" /> Assigned Patient
                  </p>
                  {schedule.patient ? (
                    <p className="font-medium">
                      {schedule.patient.first_name} {schedule.patient.last_name}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">No patient assigned</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
