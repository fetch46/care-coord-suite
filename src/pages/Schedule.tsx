import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Table as TableIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase } from "@/integrations/supabase/client";

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
  status: string;
  patient_id?: string;
  staff: Staff;
  patient?: Patient;
}

export default function Schedule() {
  // State for data and filters
  const [schedule, setSchedule] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  // Calendar current month/year state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    available: 0,
    booked: 0,
    onLeave: 0,
  });

  useEffect(() => {
    fetchSchedule();
    fetchDashboardStats();
  }, [page, searchTerm, statusFilter, dateFilter]);

  // Utility: format date for filtering
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // Server-side fetch with filtering & pagination
  async function fetchSchedule() {
    setLoading(true);
    try {
      let query = supabase
        .from("availabilities")
        .select(
          `
          *,
          staff:staff!staff_id (
            id,
            first_name,
            last_name,
            role,
            profile_image_url
          ),
          patient:patients!patient_id (
            id,
            first_name,
            last_name
          )
        `,
          { count: "exact" }
        )
        .order("start_time", { ascending: true })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Filter status if not "All"
      if (statusFilter !== "All") {
        query = query.eq("status", statusFilter);
      }

      // Filter date
      const today = new Date();
      if (dateFilter !== "All") {
        if (dateFilter === "Today") {
          const todayStr = formatDate(today);
          query = query.gte("start_time", todayStr).lt("start_time", todayStr + "T23:59:59");
        } else if (dateFilter === "This Week") {
          const day = today.getDay();
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - day);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 7);
          query = query.gte("start_time", formatDate(weekStart)).lt("start_time", formatDate(weekEnd));
        } else if (dateFilter === "This Month") {
          const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          query = query.gte("start_time", formatDate(firstDay)).lt("start_time", formatDate(lastDay));
        }
      }

      // For search filter, Supabase doesn't support complex OR on related tables easily,
      // so we fetch all first then filter client-side.
      // To avoid too many results, if searchTerm present, fetch a larger range:
      if (searchTerm) {
        const { data } = await supabase
          .from("availabilities")
          .select(
            `
            *,
            staff:staff!staff_id (
              id,
              first_name,
              last_name,
              role,
              profile_image_url
            ),
            patient:patients!patient_id (
              id,
              first_name,
              last_name
            )
          `
          )
          .order("start_time", { ascending: true })
          .range(0, 1000); // Limit to first 1000 for performance

        if (!data) throw new Error("Failed to fetch data for search");

        // Filter client-side for search
        const filtered = data.filter((item) => {
          const staffName = `${item.staff.first_name} ${item.staff.last_name}`.toLowerCase();
          const staffRole = item.staff.role.toLowerCase();
          const patientName = item.patient
            ? `${item.patient.first_name} ${item.patient.last_name}`.toLowerCase()
            : "";
          const term = searchTerm.toLowerCase();
          return (
            staffName.includes(term) ||
            staffRole.includes(term) ||
            patientName.includes(term)
          );
        });

        setTotalCount(filtered.length);
        // Pagination slice client-side:
        setSchedule(filtered.slice((page - 1) * pageSize, page * pageSize));
      } else {
        const { data, error, count } = await query;
        if (error) throw error;
        setSchedule(data || []);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDashboardStats() {
    try {
      const { count: total } = await supabase
        .from("availabilities")
        .select("*", { count: "exact", head: true });

      const { count: available } = await supabase
        .from("availabilities")
        .select("*", { count: "exact", head: true })
        .eq("status", "Available");

      const { count: booked } = await supabase
        .from("availabilities")
        .select("*", { count: "exact", head: true })
        .eq("status", "Booked");

      const { count: onLeave } = await supabase
        .from("availabilities")
        .select("*", { count: "exact", head: true })
        .eq("status", "On Leave");

      setDashboardStats({
        total: total || 0,
        available: available || 0,
        booked: booked || 0,
        onLeave: onLeave || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }

  // Helpers for calendar
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()); // Start from Sunday of the week of first day

  // Prepare calendar dates (35 cells for 5 weeks)
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Filter schedule for calendar days
  const scheduleByDay = useMemo(() => {
    const map = new Map<string, Availability[]>();
    schedule.forEach((item) => {
      const day = new Date(item.start_time).toDateString();
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(item);
    });
    return map;
  }, [schedule]);

  // Pagination controls helpers
  const totalPages = Math.ceil(totalCount / pageSize);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
            {/* Header & Actions */}
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl font-semibold">Schedule</h1>
              <div className="flex items-center gap-2">
                <Button asChild>
                  <Link to="/schedules/new">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Link>
                </Button>
                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(val) => setViewMode(val as "table" | "calendar")}
                >
                  <ToggleGroupItem value="table">
                    <TableIcon className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="calendar">
                    <CalendarDays className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <Card className="p-4 flex items-center gap-4">
                <Users className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Slots</p>
                  <p className="text-xl font-bold">{dashboardStats.total}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <UserCheck className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-xl font-bold">{dashboardStats.available}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <UserX className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Booked</p>
                  <p className="text-xl font-bold">{dashboardStats.booked}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <CalendarDays className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                  <p className="text-xl font-bold">{dashboardStats.onLeave}</p>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by staff or patient..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={(val) => { setDateFilter(val); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <>
                <UiTable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading schedule...
                        </TableCell>
                      </TableRow>
                    ) : schedule.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No schedule found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      schedule.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={item.staff.profile_image_url || undefined} />
                              <AvatarFallback>
                                {item.staff.first_name[0]}
                                {item.staff.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {item.staff.first_name} {item.staff.last_name}
                            </span>
                          </TableCell>
                          <TableCell>{item.staff.role}</TableCell>
                          <TableCell>{new Date(item.start_time).toLocaleString()}</TableCell>
                          <TableCell>{new Date(item.end_time).toLocaleString()}</TableCell>
                          <TableCell>
                            {item.patient
                              ? `${item.patient.first_name} ${item.patient.last_name}`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "Available"
                                  ? "secondary"
                                  : item.status === "Booked"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </UiTable>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    disabled={!canPrev}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!canNext}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </>
            )}

            {/* Calendar View */}
            {viewMode === "calendar" && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(currentDate);
                          newDate.setMonth(newDate.getMonth() - 1);
                          setCurrentDate(newDate);
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(currentDate);
                          newDate.setMonth(newDate.getMonth() + 1);
                          setCurrentDate(newDate);
                        }}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="p-2 text-center font-medium text-muted-foreground"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((date, idx) => {
                      const daySchedule = scheduleByDay.get(date.toDateString()) || [];
                      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                      const isToday = date.toDateString() === new Date().toDateString();

                      return (
                        <div
                          key={idx}
                          className={`min-h-[80px] p-2 border rounded-lg ${
                            isCurrentMonth ? "bg-background" : "bg-muted/30"
                          } ${isToday ? "ring-2 ring-primary" : ""}`}
                        >
                          <div
                            className={`text-sm font-medium mb-1 ${
                              isCurrentMonth
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {daySchedule.slice(0, 2).map((item) => (
                              <div
                                key={item.id}
                                className={`text-xs p-1 rounded text-white truncate ${
                                  item.status === "Available"
                                    ? "bg-green-500"
                                    : item.status === "Booked"
                                    ? "bg-blue-500"
                                    : "bg-red-500"
                                }`}
                                title={`${item.staff.first_name} ${item.staff.last_name} - ${item.status}`}
                              >
                                {item.staff.first_name} {item.staff.last_name[0]}.
                              </div>
                            ))}
                            {daySchedule.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{daySchedule.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
