import { useState, useEffect, useMemo } from "react";
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
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    upcoming: 0,
  });

  useEffect(() => {
    fetchAssessments();
    fetchDashboardStats();
  }, [page, searchTerm, filterType, filterDate]);

  /** Fetch assessments with pagination and server-side filters */
  const fetchAssessments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("assessments")
        .select("*", { count: "exact" })
        .order("date", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (searchTerm) {
        query = query.or(
          `client.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%`
        );
      }
      if (filterType) query = query.eq("type", filterType);
      if (filterDate) query = query.eq("date", filterDate);

      const { data, error, count } = await query;
      if (error) throw error;

      setAssessments(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch dashboard stats */
  const fetchDashboardStats = async () => {
    try {
      const { count: total } = await supabase
        .from("assessments")
        .select("*", { count: "exact", head: true });

      const today = format(new Date(), "yyyy-MM-dd");

      const { count: upcoming } = await supabase
        .from("assessments")
        .select("*", { count: "exact", head: true })
        .gt("date", today);

      setDashboardStats({
        total: total || 0,
        upcoming: upcoming || 0,
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
                  <p className="text-muted-foreground mt-1">
                    Review and manage assessments
                  </p>
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
                      <Link to="/create-assessment/patient" className="flex items-center gap-2 p-2">
                        <User className="w-4 h-4" />
                        Patient Assessment
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

              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{dashboardStats.total}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{dashboardStats.upcoming}</p>
                  </CardContent>
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
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Filter by Type"
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <CalendarCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="date"
                        value={filterDate}
                        onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
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
                            <TableCell className="font-semibold">{assessment.type}</TableCell>
                            <TableCell>{assessment.client}</TableCell>
                            <TableCell>{assessment.date}</TableCell>
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
                  disabled={page === totalPages} 
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
