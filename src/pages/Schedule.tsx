import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, ChevronRight, CalendarDays, Table } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";

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
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [currentDate] = useState(new Date());

  const now = new Date();
  const todayStr = now.toDateString();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const schedule: Availability[] = [
    {
      id: "1",
      staff_id: "s1",
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      status: "Available",
      staff: {
        id: "s1",
        first_name: "Alice",
        last_name: "Johnson",
        role: "Nurse",
        profile_image_url: ""
      }
    },
    {
      id: "2",
      staff_id: "s2",
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      status: "Booked",
      staff: {
        id: "s2",
        first_name: "Bob",
        last_name: "Smith",
        role: "Caregiver",
        profile_image_url: ""
      },
      patient: {
        id: "p1",
        first_name: "John",
        last_name: "Doe"
      }
    }
  ];

  const filteredSchedule = useMemo(() => {
    return schedule.filter((item) =>
      (statusFilter === "All" || item.status === statusFilter) &&
      (dateFilter === "All" ||
        (dateFilter === "Today" && new Date(item.start_time).toDateString() === todayStr) ||
        (dateFilter === "This Week" &&
          new Date(item.start_time) >= weekStart &&
          new Date(item.start_time) <= weekEnd) ||
        (dateFilter === "This Month" &&
          new Date(item.start_time).getMonth() === now.getMonth() &&
          new Date(item.start_time).getFullYear() === now.getFullYear())
      ) &&
      (
        `${item.staff.first_name} ${item.staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.patient &&
          `${item.patient.first_name} ${item.patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [schedule, searchTerm, statusFilter, dateFilter]);

  return (
    <SidebarProvider>
      <SidebarInset>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 space-y-4">
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
                    <Table className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="calendar">
                    <CalendarDays className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search by staff or patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              <Select value={dateFilter} onValueChange={setDateFilter}>
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

            {viewMode === "table" && (
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
                  {filteredSchedule.map((item) => (
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
                        <Badge>{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </UiTable>
            )}

            {viewMode === "calendar" && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Calendar view coming soon.
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
