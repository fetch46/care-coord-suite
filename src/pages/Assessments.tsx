import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Search,
  Plus,
  Filter,
  CalendarCheck,
  SlidersHorizontal,
  ChevronDown,
  User,
  Users,
  ClipboardList,
  CheckCircle2,
  Hourglass,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Assessments() {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchAssessments();
    fetchDashboardStats();
  }, [page, searchTerm, filterType, filterDate]);

  // Fetch paginated assessments with server-side filters
  const fetchAssessments = async () => {
    setLoading(true);
    try {
      // Fetch both patient assessments and comprehensive assessments
      const [patientAssessmentsQuery, comprehensiveAssessmentsQuery] = await Promise.all([
        supabase
          .from("patient_assessments")
          .select("*", { count: "exact" })
          .order("assessment_date", { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1),
        supabase
          .from("comprehensive_patient_assessments")
          .select("*", { count: "exact" })
          .order("assessment_date", { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1)
      ]);

      const patientAssessments = patientAssessmentsQuery.data || [];
      const comprehensiveAssessments = comprehensiveAssessmentsQuery.data || [];

      // Combine and format assessments
      const combinedAssessments = [
        ...patientAssessments.map(assessment => ({
          ...assessment,
          source: 'patient_assessments'
        })),
        ...comprehensiveAssessments.map(assessment => ({
          ...assessment,
          title: assessment.assessor_name || 'Comprehensive Assessment',
          source: 'comprehensive_patient_assessments'
        }))
      ].sort((a, b) => new Date(b.assessment_date).getTime() - new Date(a.assessment_date).getTime());

      // Apply filters
      let filteredAssessments = combinedAssessments;
      if (searchTerm) {
        filteredAssessments = filteredAssessments.filter(assessment =>
          assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.assessment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.assessor_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (filterType) {
        filteredAssessments = filteredAssessments.filter(assessment => 
          assessment.assessment_type === filterType
        );
      }
      if (filterDate) {
        filteredAssessments = filteredAssessments.filter(assessment => 
          assessment.assessment_date === filterDate
        );
      }

      setAssessments(filteredAssessments);
      setTotalCount(filteredAssessments.length);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast({
        title: "Error",
        description: "Failed to load assessments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard summary stats
  const fetchDashboardStats = async () => {
    try {
      const [patientAssessments, comprehensiveAssessments] = await Promise.all([
        supabase
          .from("patient_assessments")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("comprehensive_patient_assessments")
          .select("*", { count: "exact", head: true })
      ]);

      const total = (patientAssessments.count || 0) + (comprehensiveAssessments.count || 0);

      const today = format(new Date(), "yyyy-MM-dd");

      const [upcomingPatient, upcomingComprehensive] = await Promise.all([
        supabase
          .from("patient_assessments")
          .select("*", { count: "exact", head: true })
          .gt("assessment_date", today),
        supabase
          .from("comprehensive_patient_assessments")
          .select("*", { count: "exact", head: true })
          .gt("assessment_date", today)
      ]);

      const upcoming = (upcomingPatient.count || 0) + (upcomingComprehensive.count || 0);

      const [completedPatient, completedComprehensive] = await Promise.all([
        supabase
          .from("patient_assessments")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed"),
        supabase
          .from("comprehensive_patient_assessments")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed")
      ]);

      const completed = (completedPatient.count || 0) + (completedComprehensive.count || 0);

      const [pendingPatient, pendingComprehensive] = await Promise.all([
        supabase
          .from("patient_assessments")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("comprehensive_patient_assessments")
          .select("*", { count: "exact", head: true })
          .eq("status", "draft")
      ]);

      const pending = (pendingPatient.count || 0) + (pendingComprehensive.count || 0);

      setDashboardStats({
        total,
        upcoming,
        completed,
        pending,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterDate("");
    setPage(1);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-none w-full space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
                  <p className="text-muted-foreground mt-1">Review and manage assessments</p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gradient-primary text-white hover:opacity-90 flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Add Assessment
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/patient-assessment" className="flex items-center gap-2 p-2">
                        <User className="w-4 h-4" />
                        Comprehensive Assessment
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/create-assessment/caregiver" className="flex items-center gap-2 p-2">
                        <Users className="w-4 h-4" />
                        Caregiver Assessment
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Modern Dashboard Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <Card className="p-4 flex items-center gap-4">
                  <ClipboardList className="w-8 h-8 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                    <p className="text-xl font-bold">{dashboardStats.total}</p>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-4">
                  <CalendarCheck className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                    <p className="text-xl font-bold">{dashboardStats.upcoming}</p>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-xl font-bold">{dashboardStats.completed}</p>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-4">
                  <Hourglass className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                    <p className="text-xl font-bold">{dashboardStats.pending}</p>
                  </div>
                </Card>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardContent className="p-12">
                  <div className="flex gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search assessments by client, type, or status..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setPage(1);
                        }}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Filter by Type"
                        value={filterType}
                        onChange={(e) => {
                          setFilterType(e.target.value);
                          setPage(1);
                        }}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <CalendarCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="date"
                        value={filterDate}
                        onChange={(e) => {
                          setFilterDate(e.target.value);
                          setPage(1);
                        }}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" onClick={clearFilters}>
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Assessments Table */}
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Icon</TableHead>
                        <TableHead>Assessment Type</TableHead>
                        <TableHead>Participant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading assessments...
                          </TableCell>
                        </TableRow>
                      ) : assessments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No assessments found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        assessments.map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell>
                              <CalendarCheck className="w-6 h-6 text-primary" />
                            </TableCell>
                            <TableCell className="font-semibold">{assessment.assessment_type}</TableCell>
                            <TableCell>{assessment.title}</TableCell>
                            <TableCell>{format(new Date(assessment.assessment_date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{assessment.status}</TableCell>
                            <TableCell>
                              <Link
                                to={`/assessment/${assessment.id}`}
                                className="text-sm text-primary hover:underline font-medium"
                              >
                                View
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
