import { useState, useEffect } from "react";
import { Search, Filter, Download, Calendar, User, Clock } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimesheetReport {
  id: string;
  caregiver_name: string;
  client_name: string;
  week_ending: string;
  total_hours: number;
  status: string;
  submitted_date: string;
  caregiver_id: string;
  client_id: string;
}

interface Caregiver {
  id: string;
  first_name: string;
  last_name: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

export default function TimesheetReports() {
  const [timesheets, setTimesheets] = useState<TimesheetReport[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCaregiver, setSelectedCaregiver] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch caregivers and patients for filters
      const [caregiversResponse, patientsResponse] = await Promise.all([
        supabase.from("caregivers").select("id, first_name, last_name").eq("status", "Active"),
        supabase.from("patients").select("id, first_name, last_name").eq("status", "Active")
      ]);

      if (caregiversResponse.error) throw caregiversResponse.error;
      if (patientsResponse.error) throw patientsResponse.error;

      setCaregivers(caregiversResponse.data || []);
      setPatients(patientsResponse.data || []);

      // Generate mock timesheet data since we don't have a timesheets table yet
      generateMockTimesheets();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockTimesheets = () => {
    // Mock data for demonstration
    const mockTimesheets: TimesheetReport[] = [
      {
        id: "1",
        caregiver_name: "Sarah Davis",
        client_name: "John Smith",
        week_ending: "2024-01-21",
        total_hours: 40.0,
        status: "approved",
        submitted_date: "2024-01-22",
        caregiver_id: "caregiver-1",
        client_id: "patient-1"
      },
      {
        id: "2",
        caregiver_name: "Michael Thompson",
        client_name: "Mary Johnson",
        week_ending: "2024-01-21",
        total_hours: 35.5,
        status: "pending",
        submitted_date: "2024-01-22",
        caregiver_id: "caregiver-2",
        client_id: "patient-2"
      },
      {
        id: "3",
        caregiver_name: "Jennifer Garcia",
        client_name: "Robert Wilson",
        week_ending: "2024-01-14",
        total_hours: 42.0,
        status: "approved",
        submitted_date: "2024-01-15",
        caregiver_id: "caregiver-3",
        client_id: "patient-3"
      },
      {
        id: "4",
        caregiver_name: "David Martinez",
        client_name: "Patricia Brown",
        week_ending: "2024-01-14",
        total_hours: 38.5,
        status: "rejected",
        submitted_date: "2024-01-15",
        caregiver_id: "caregiver-4",
        client_id: "patient-4"
      }
    ];
    setTimesheets(mockTimesheets);
  };

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesSearch = timesheet.caregiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timesheet.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCaregiver = !selectedCaregiver || selectedCaregiver === "all" || timesheet.caregiver_id === selectedCaregiver;
    const matchesPatient = !selectedPatient || selectedPatient === "all" || timesheet.client_id === selectedPatient;
    const matchesStatus = !statusFilter || statusFilter === "all" || timesheet.status === statusFilter;
    
    return matchesSearch && matchesCaregiver && matchesPatient && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCaregiver("all");
    setSelectedPatient("all");
    setStatusFilter("all");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-healthcare-success/10 text-healthcare-success border-healthcare-success/20";
      case "pending": return "bg-healthcare-warning/10 text-healthcare-warning border-healthcare-warning/20";
      case "rejected": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Timesheet report is being generated...",
    });
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading timesheet reports...</div>
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
                  <h1 className="text-3xl font-bold text-foreground">Timesheet Reports</h1>
                  <p className="text-muted-foreground mt-1">View and manage submitted timesheets</p>
                </div>
                <Button onClick={handleExport} className="bg-gradient-primary text-white hover:opacity-90">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Timesheets</p>
                        <p className="text-2xl font-bold">{timesheets.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Approved</p>
                        <p className="text-2xl font-bold">
                          {timesheets.filter(t => t.status === 'approved').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <User className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold">
                          {timesheets.filter(t => t.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Clock className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Hours</p>
                        <p className="text-2xl font-bold">
                          {timesheets.reduce((sum, t) => sum + t.total_hours, 0).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search timesheets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={selectedCaregiver} onValueChange={setSelectedCaregiver}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Caregiver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Caregivers</SelectItem>
                        {caregivers.map((caregiver) => (
                          <SelectItem key={caregiver.id} value={caregiver.id}>
                            {caregiver.first_name} {caregiver.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Patients</SelectItem>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={clearFilters}>
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timesheets Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Timesheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Caregiver</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Week Ending</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTimesheets.map((timesheet) => (
                        <TableRow key={timesheet.id}>
                          <TableCell className="font-medium">
                            {timesheet.caregiver_name}
                          </TableCell>
                          <TableCell>{timesheet.client_name}</TableCell>
                          <TableCell>
                            {new Date(timesheet.week_ending).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-mono">
                            {timesheet.total_hours.toFixed(1)} hrs
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(timesheet.status)}>
                              {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(timesheet.submitted_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredTimesheets.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No timesheets found matching your criteria.
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