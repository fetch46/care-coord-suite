import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Timesheet() {
  const [timesheets, setTimesheets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("timesheets")
        .select(`
          id,
          caregiver,
          date,
          hours,
          status
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      setTimesheets(data || []);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTimesheets = timesheets.filter(ts =>
    ts.caregiver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ts.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ts.date?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <p className="text-muted-foreground mt-1">
                    Review and manage submitted timesheets
                  </p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90" asChild>
                  <Link to="/digital-timesheet">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Timesheet
                  </Link>
                </Button>
              </div>

              {/* Search and Filter */}
              <Card>
                <CardContent className="p-12">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search timesheets by caregiver, date, or status..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
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
                      ) : filteredTimesheets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No timesheets found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTimesheets.map(ts => (
                          <TableRow key={ts.id}>
                            <TableCell>
                              <Clock className="w-6 h-6 text-primary" />
                            </TableCell>
                            <TableCell className="font-semibold">
                              {ts.caregiver}
                            </TableCell>
                            <TableCell>{ts.date}</TableCell>
                            <TableCell>{ts.hours}</TableCell>
                            <TableCell>{ts.status}</TableCell>
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
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
