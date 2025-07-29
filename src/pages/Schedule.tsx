import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Calendar as CalendarIcon, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function Schedule() {
  const [schedule, setSchedule] = useState<Availability[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from("availabilities")
        .select(`
          id,
          start_time,
          end_time,
          status,
          staff:staff_id (id, first_name, last_name, role, profile_image_url),
          patient:patient_id (id, first_name, last_name)
        `)
        .order("start_time", { ascending: true });

      if (error) throw error;
      setSchedule((data as Availability[]) || []);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedule = schedule.filter((item) =>
    `${item.staff.first_name} ${item.staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.patient && `${item.patient.first_name} ${item.patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800 border-green-200";
      case "Booked": return "bg-blue-100 text-blue-800 border-blue-200";
      case "On Leave": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calendarEvents = filteredSchedule.map((item) => ({
    id: item.id,
    title: `${item.staff.first_name} ${item.staff.last_name} (${item.status})`,
    start: new Date(item.start_time),
    end: new Date(item.end_time),
    resource: item,
  }));

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading schedule...</div>
            </div>
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
            <div className="w-full space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
                  <p className="text-muted-foreground mt-1">Manage staff availability and patient appointments</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setViewMode(viewMode === "table" ? "calendar" : "table")}>
                    {viewMode === "table" ? <CalendarIcon className="w-4 h-4 mr-2" /> : <List className="w-4 h-4 mr-2" />}
                    {viewMode === "table" ? "Calendar View" : "Table View"}
                  </Button>
                  <Button className="bg-gradient-primary text-white hover:opacity-90" asChild>
                    <Link to="/schedule/new">
                      <Plus className="w-4 h-4 mr-2" /> New Schedule
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Search */}
              {viewMode === "table" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by staff name, role, or patient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Schedule Table or Calendar */}
              {viewMode === "table" ? (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Staff Member</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSchedule.map((item) => {
                          const start = new Date(item.start_time);
                          const end = new Date(item.end_time);
                          const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
                          return (
                            <TableRow key={item.id} className="hover:bg-muted/50">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    {item.staff.profile_image_url && <AvatarImage src={item.staff.profile_image_url} />}
                                    <AvatarFallback>{item.staff.first_name[0]}{item.staff.last_name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div className="font-medium">{item.staff.first_name} {item.staff.last_name}</div>
                                </div>
                              </TableCell>
                              <TableCell>{item.staff.role}</TableCell>
                              <TableCell>
                                <div className="text-sm font-medium">{formatDateTime(item.start_time)}</div>
                                <div className="text-xs text-muted-foreground">to {formatDateTime(item.end_time)}</div>
                              </TableCell>
                              <TableCell><Badge variant="outline">{duration} min</Badge></TableCell>
                              <TableCell>{item.patient ? `${item.patient.first_name} ${item.patient.last_name}` : <span className="text-muted-foreground">Not assigned</span>}</TableCell>
                              <TableCell><Badge className={getStatusColor(item.status)}>{item.status}</Badge></TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/schedule/${item.id}`}>View</Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {filteredSchedule.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No schedule items found matching your search." : "No schedule items found."}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <Calendar
                      localizer={localizer}
                      events={calendarEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: 600 }}
                      eventPropGetter={(event) => ({
                        style: {
                          backgroundColor: event.resource.status === "Booked" ? "#3b82f6" : event.resource.status === "Available" ? "#22c55e" : "#9ca3af",
                          color: "white",
                          borderRadius: "6px",
                          padding: "4px",
                        },
                      })}
                      onSelectEvent={(event) => window.location.href = `/schedule/${event.id}`}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
