import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, ChevronRight } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export default function Schedule() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");

  // Dummy data only
  const now = new Date();
  const schedule: Availability[] = [
    {
      id: "1",
      staff_id: "s1",
      start_time: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: "Available",
      staff: {
        id: "s1",
        first_name: "John",
        last_name: "Doe",
        role: "Nurse",
        profile_image_url: "",
      },
    },
    {
      id: "2",
      staff_id: "s2",
      start_time: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      status: "Booked",
      staff: {
        id: "s2",
        first_name: "Emily",
        last_name: "Smith",
        role: "Doctor",
        profile_image_url: "",
      },
      patient: {
        id: "p1",
        first_name: "Michael",
        last_name: "Johnson",
      },
    },
    {
      id: "3",
      staff_id: "s3",
      start_time: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      status: "On Leave",
      staff: {
        id: "s3",
        first_name: "Sarah",
        last_name: "Brown",
        role: "Therapist",
        profile_image_url: "",
      },
    },
  ];

  const filteredSchedule = useMemo(
    () =>
      schedule.filter(
        (item) =>
          (statusFilter === "All" || item.status === statusFilter) &&
          `${item.staff.first_name} ${item.staff.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.patient &&
            `${item.patient.first_name} ${item.patient.last_name}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      ),
    [schedule, searchTerm, statusFilter]
  );

  const formatDateTime = (dateString: string): string => {
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

  const getStatusColor = (status: string) =>
    statusColorMap[status] || statusColorMap["On Leave"];

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
                  <p className="text-muted-foreground mt-1">
                    Manage staff availability and patient appointments
                  </p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90" asChild>
                  <Link to="/schedule/new">
                    <Plus className="w-4 h-4 mr-2" />
                    New Schedule
                  </Link>
                </Button>
              </div>

              {/* Mini Dashboard */}
              <Card className="border-0">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Today's Appointments */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-800">Today's Appointments</div>
                      <div className="text-2xl font-bold text-blue-800 mt-1">12</div>
                    </div>
                    
                    {/* Completed */}
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <div className="text-sm font-medium text-green-800">Completed</div>
                      <div className="text-2xl font-bold text-green-800 mt-1">8</div>
                    </div>
                    
                    {/* Pending */}
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                      <div className="text-sm font-medium text-amber-800">Pending</div>
                      <div className="text-2xl font-bold text-amber-800 mt-1">3</div>
                    </div>
                    
                    {/* Cancelled */}
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                      <div className="text-sm font-medium text-red-800">Cancelled</div>
                      <div className="text-2xl font-bold text-red-800 mt-1">1</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by staff name, role, or patient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Status
                        </label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Booked">Booked</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Date Filter */}
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Date Range
                        </label>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Dates</SelectItem>
                            <SelectItem value="Today">Today</SelectItem>
                            <SelectItem value="This Week">This Week</SelectItem>
                            <SelectItem value="This Month">This Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                                  <AvatarImage
                                    src={item.staff.profile_image_url || "/default-avatar.png"}
                                    alt={`${item.staff.first_name} ${item.staff.last_name}`}
                                  />
                                  <AvatarFallback className="bg-gradient-blue text-white">
                                    {item.staff.first_name[0]}
                                    {item.staff.last_name[0]}
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
                              <div className="text-sm">{item.staff.role}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">{formatDateTime(item.start_time)}</div>
                              <div className="text-xs text-muted-foreground">
                                to {formatDateTime(item.end_time)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{duration} min</Badge>
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
                      {searchTerm || statusFilter !== "All" || dateFilter !== "All"
                        ? "No schedule items found matching your filters."
                        : "No schedule items found."}
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
