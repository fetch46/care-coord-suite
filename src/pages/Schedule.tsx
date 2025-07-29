import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Calendar, ChevronRight } from "lucide-react";
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

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_image_url?: string;
}

interface Availability {
  id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  status: "Available" | "Booked" | "On Leave";
}

interface ScheduleItem extends Availability {
  staff: Staff;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
      setSchedule(data as ScheduleItem[] || []);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedule = schedule.filter(item =>
    `${item.staff.first_name} ${item.staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.patient && `${item.patient.first_name} ${item.patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800 border-green-200";
      case "Booked": return "bg-blue-100 text-blue-800 border-blue-200";
      case "On Leave": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
            <div className="max-w-none w-full space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
                  <p className="text-muted-foreground mt-1">Manage staff availability and patient appointments</p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90" asChild>
                  <Link to="/schedule/new">
                    <Plus className="w-4 h-4 mr-2" />
                    New Schedule
                  </Link>
                </Button>
              </div>

              {/* Search */}
              <Card>
                <CardContent className="p-12">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by staff name, role, or patient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Table */}
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
                                  <AvatarImage src={item.staff.profile_image_url} />
                                  <AvatarFallback className="bg-gradient-blue text-white">
                                    {item.staff.first_name[0]}{item.staff.last_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-foreground">
                                    {item.staff.first_name} {item.staff.last_name}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {item.staff.role}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">
                                {formatDateTime(item.start_time)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                to {formatDateTime(item.end_time)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {duration} min
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.patient ? (
                                <div className="font-medium">
                                  {item.patient.first_name} {item.patient.last_name}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Not assigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/schedule/${item.id}`}>
                                  <ChevronRight className="w-4 h-4" />
                                </Link>
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
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
