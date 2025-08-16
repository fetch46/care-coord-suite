import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, Clock, Users, Calendar, CheckCircle2, Hourglass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function Timesheet() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    recent: 0,
  });

  useEffect(() => {
    fetchTimesheets();
    fetchDashboardStats();
  }, [page, searchTerm]);

  async function fetchTimesheets() {
    setLoading(true);
    try {
      let query = supabase
        .from("timesheets")
        .select(`
          *,
          caregiver:staff!caregiver_id(first_name, last_name),
          patient:patients!patient_id(first_name, last_name)
        `, { count: "exact" })
        .order("work_date", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Filter by submitted status to show only submitted timesheets
      query = query.eq("status", "submitted");

      const { data, error, count } = await query;
      if (error) throw error;

      // Format the data for display
      const formattedTimesheets = (data || []).map((timesheet: any) => ({
        ...timesheet,
        caregiver_name: timesheet.caregiver && timesheet.caregiver.first_name
          ? `${timesheet.caregiver.first_name} ${timesheet.caregiver.last_name}`
          : 'Unknown Caregiver',
        patient_name: timesheet.patient && timesheet.patient.first_name
          ? `${timesheet.patient.first_name} ${timesheet.patient.last_name}`
          : 'Unknown Patient'
      }));

      setTimesheets(formattedTimesheets);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDashboardStats() {
    try {
      const { count: total } = await supabase
        .from("timesheets")
        .select("*", { count: "exact", head: true });

      const { count: completed } = await supabase
        .from("timesheets")
        .select("*", { count: "exact", head: true })
        .eq("status", "Completed");

      const { count: pending } = await supabase
        .from("timesheets")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pending");

      // Recent timesheets in last 7 days
      const recentDate = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
      const { count: recent } = await supabase
        .from("timesheets")
        .select("*", { count: "exact", head: true })
        .gte("date", recentDate);

      setDashboardStats({
        total: total || 0,
        completed: completed || 0,
        pending: pending || 0,
        recent: recent || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  const clearSearch = () => {
    setSearchTerm("");
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
                  <h1 className="text-3xl font-bold text-foreground">Timesheets</h1>
                  <p className="text-muted-foreground mt-1">Review and manage submitted timesheets</p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90" asChild>
                  <Link to="/digital-timesheet">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Timesheet
                  </Link>
                </Button>
              </div>

              {/* Dashboard cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <Card className="p-4 flex items-center gap-4">
                  <Users className="w-8 h-8 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Timesheets</p>
                    <p className="text-xl font-bold">{dashboardStats.total}</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold">{dashboardStats.pending}</p>
                  </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last 7 Days</p>
                    <p className="text-xl font-bold">{dashboardStats.recent}</p>
                  </div>
                </Card>
              </div>

              {/* Search */}
              <Card>
                <CardContent className="p-12">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by caregiver, date, or status..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setPage(1);
                        }}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" onClick={clearSearch}>
                      <Filter className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timesheet Table */}
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Type</TableHead>
                        <TableHead>Caregiver</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-32"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading timesheets...
                          </TableCell>
                        </TableRow>
                      ) : timesheets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No timesheets found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        timesheets.map((ts) => (
                          <TableRow key={ts.id}>
                            <TableCell>
                              <Clock className="w-6 h-6 text-primary" />
                            </TableCell>
                            <TableCell className="font-semibold">{ts.caregiver_name}</TableCell>
                            <TableCell>{new Date(ts.work_date).toLocaleDateString()}</TableCell>
                            <TableCell>{ts.total_hours || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {ts.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Link
                                to={`/timesheet/${ts.id}`}
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
