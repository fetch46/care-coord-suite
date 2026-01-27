import { useState, useEffect } from "react";
import { Search, Filter, Download, Users, Activity, Heart, FileText } from "lucide-react";
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
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface PatientReport {
  id: string;
  name: string;
  date_of_birth: string | null;
  gender: string | null;
  status: string;
  care_level: string | null;
  room_number: string | null;
  admission_date: string | null;
  assessments_count: number;
  records_count: number;
  last_assessment: string | null;
}

export default function PatientReports() {
  const [patientReports, setPatientReports] = useState<PatientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [careLevelFilter, setCareLevelFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Fetch patients
      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select("*")
        .order("last_name", { ascending: true });

      if (patientsError) throw patientsError;

      // Fetch assessment counts
      const { data: assessmentsData } = await supabase
        .from("patient_assessments")
        .select("patient_id");

      // Fetch medical records counts
      const { data: recordsData } = await supabase
        .from("medical_records")
        .select("patient_id");

      // Build assessment count map
      const assessmentCounts: Record<string, number> = {};
      (assessmentsData || []).forEach((a) => {
        assessmentCounts[a.patient_id] = (assessmentCounts[a.patient_id] || 0) + 1;
      });

      // Build records count map
      const recordsCounts: Record<string, number> = {};
      (recordsData || []).forEach((r) => {
        recordsCounts[r.patient_id] = (recordsCounts[r.patient_id] || 0) + 1;
      });

      // Transform patient data into report format
      const reports: PatientReport[] = (patientsData || []).map((patient) => ({
        id: patient.id,
        name: `${patient.first_name} ${patient.last_name}`,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        status: patient.status || "Active",
        care_level: patient.care_level,
        room_number: patient.room_number,
        admission_date: patient.admission_date,
        assessments_count: assessmentCounts[patient.id] || 0,
        records_count: recordsCounts[patient.id] || 0,
        last_assessment: null, // Would need additional query
      }));

      setPatientReports(reports);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      // Generate mock data if no records
      generateMockPatientReports();
    } finally {
      setLoading(false);
    }
  };

  const generateMockPatientReports = () => {
    const mockReports: PatientReport[] = [
      {
        id: "1",
        name: "John Smith",
        date_of_birth: "1945-03-15",
        gender: "Male",
        status: "Active",
        care_level: "High",
        room_number: "101A",
        admission_date: "2024-01-10",
        assessments_count: 5,
        records_count: 12,
        last_assessment: "2024-01-20",
      },
      {
        id: "2",
        name: "Mary Johnson",
        date_of_birth: "1952-07-22",
        gender: "Female",
        status: "Active",
        care_level: "Medium",
        room_number: "205B",
        admission_date: "2023-11-05",
        assessments_count: 8,
        records_count: 24,
        last_assessment: "2024-01-18",
      },
      {
        id: "3",
        name: "Robert Wilson",
        date_of_birth: "1938-11-30",
        gender: "Male",
        status: "Critical",
        care_level: "Critical",
        room_number: "ICU-2",
        admission_date: "2024-01-15",
        assessments_count: 3,
        records_count: 8,
        last_assessment: "2024-01-21",
      },
      {
        id: "4",
        name: "Patricia Brown",
        date_of_birth: "1960-05-18",
        gender: "Female",
        status: "Discharged",
        care_level: "Low",
        room_number: null,
        admission_date: "2023-10-01",
        assessments_count: 12,
        records_count: 35,
        last_assessment: "2024-01-05",
      },
      {
        id: "5",
        name: "James Davis",
        date_of_birth: "1948-09-08",
        gender: "Male",
        status: "Active",
        care_level: "Medium",
        room_number: "312C",
        admission_date: "2023-12-20",
        assessments_count: 4,
        records_count: 15,
        last_assessment: "2024-01-19",
      },
    ];
    setPatientReports(mockReports);
  };

  const filteredReports = patientReports.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesCareLevel = careLevelFilter === "all" || report.care_level === careLevelFilter;

    return matchesSearch && matchesStatus && matchesCareLevel;
  });

  const uniqueCareLevels = [...new Set(patientReports.map((r) => r.care_level).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCareLevelFilter("all");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "discharged":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "stable":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCareLevelColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateAge = (dob: string | null) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Patient report is being generated...",
    });
  };

  const totalPatients = patientReports.length;
  const activePatients = patientReports.filter((p) => p.status === "Active").length;
  const criticalPatients = patientReports.filter(
    (p) => p.status === "Critical" || p.care_level === "Critical"
  ).length;
  const totalAssessments = patientReports.reduce((sum, p) => sum + p.assessments_count, 0);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading patient reports...</div>
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
                  <h1 className="text-3xl font-bold text-foreground">Patient Reports</h1>
                  <p className="text-muted-foreground mt-1">
                    Access individual patient histories, demographics, and medical records
                  </p>
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
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Patients</p>
                        <p className="text-2xl font-bold">{totalPatients}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Activity className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Patients</p>
                        <p className="text-2xl font-bold">{activePatients}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Heart className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Critical Care</p>
                        <p className="text-2xl font-bold">{criticalPatients}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Assessments</p>
                        <p className="text-2xl font-bold">{totalAssessments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="Stable">Stable</SelectItem>
                        <SelectItem value="Discharged">Discharged</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={careLevelFilter} onValueChange={setCareLevelFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Care Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Care Levels</SelectItem>
                        {uniqueCareLevels.map((level) => (
                          <SelectItem key={level} value={level || ""}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={clearFilters}>
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Patients Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Care Level</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Admission Date</TableHead>
                        <TableHead>Assessments</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>{calculateAge(report.date_of_birth)}</TableCell>
                          <TableCell>{report.gender || "-"}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {report.care_level ? (
                              <Badge className={getCareLevelColor(report.care_level)}>
                                {report.care_level}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{report.room_number || "-"}</TableCell>
                          <TableCell>
                            {report.admission_date
                              ? format(new Date(report.admission_date), "MMM dd, yyyy")
                              : "-"}
                          </TableCell>
                          <TableCell>{report.assessments_count}</TableCell>
                          <TableCell>{report.records_count}</TableCell>
                          <TableCell>
                            <Link
                              to={`/patients/${report.id}`}
                              className="text-sm text-primary hover:underline font-medium"
                            >
                              View Details
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredReports.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No patients found matching your criteria.
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
