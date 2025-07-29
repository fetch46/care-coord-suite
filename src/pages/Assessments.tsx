import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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

export default function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      // Mock data for now, replace with actual Supabase fetch when ready
      const data = [
        {
          id: "1",
          type: "Initial Assessment",
          client: "Alice Smith",
          date: "2024-07-20",
          status: "Completed",
        },
        {
          id: "2",
          type: "Risk Assessment",
          client: "Bob Johnson",
          date: "2024-07-22",
          status: "Pending Review",
        },
        {
          id: "3",
          type: "Care Plan Review",
          client: "Charlie Brown",
          date: "2024-07-25",
          status: "Scheduled",
        },
        {
          id: "4",
          type: "Initial Assessment",
          client: "Diana Prince",
          date: "2024-07-18",
          status: "Completed",
        },
      ];
      setAssessments(data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch =
      assessment.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType ? assessment.type === filterType : true;
    const matchesDate = filterDate ? assessment.date === filterDate : true;

    return matchesSearch && matchesType && matchesDate;
  });

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
                
                {/* Dropdown Button */}
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
                      <Link 
                        to="/create-assessment/patient" 
                        className="flex items-center gap-2 p-2 cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        Create Patient Assessment
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/create-assessment/caregiver" 
                        className="flex items-center gap-2 p-2 cursor-pointer"
                      >
                        <Users className="w-4 h-4" />
                        Create Caregiver Assessment
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search and Filter */}
              <Card>
                <CardContent className="p-12">
                  <div className="flex gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search assessments by client, type, or status..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {/* Filter by Assessment Type */}
                    <div className="relative">
                      <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Filter by Type (e.g., Initial Assessment)"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {/* Filter by Assessment Date */}
                    <div className="relative">
                      <CalendarCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" onClick={() => {setFilterType(""); setFilterDate(""); setSearchTerm("")}}>
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Assessment Table */}
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Icon</TableHead>
                        <TableHead>Assessment Type</TableHead>
                        <TableHead>Participant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-32"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading assessments...
                          </TableCell>
                        </TableRow>
                      ) : filteredAssessments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No assessments found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAssessments.map(assessment => (
                          <TableRow key={assessment.id}>
                            <TableCell>
                              <CalendarCheck className="w-6 h-6 text-primary" />
                            </TableCell>
                            <TableCell className="font-semibold">
                              {assessment.type}
                            </TableCell>
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
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
