import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter, Users, FileText, Clock, ClipboardList } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const reports = [
  {
    title: "Staff Reports",
    url: "/staff-reports",
    description: "View staff performance, attendance, and assignment details.",
    icon: Users,
  },
  {
    title: "Assessment Reports",
    url: "/assessment-reports",
    description: "Analyze patient assessments, outcomes, and care recommendations.",
    icon: ClipboardList,
  },
  {
    title: "Timesheet Reports",
    url: "/timesheet-reports",
    description: "Review submitted timesheets, overtime, and shift histories.",
    icon: Clock,
  },
  {
    title: "Patient Reports",
    url: "/patient-reports",
    description: "Access individual patient histories, demographics, and medical records.",
    icon: FileText,
  },
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <h1 className="text-3xl font-bold text-foreground">Reports</h1>
                  <p className="text-muted-foreground mt-1">
                    Access and analyze organizational reports
                  </p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90" asChild>
                  <Link to="/reports/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Report
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
                        placeholder="Search reports by name or description..."
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

              {/* Reports Table */}
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Type</TableHead>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-32"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map(report => (
                        <TableRow key={report.title}>
                          <TableCell>
                            <report.icon className="w-6 h-6 text-primary" />
                          </TableCell>
                          <TableCell className="font-semibold">
                            {report.title}
                          </TableCell>
                          <TableCell>{report.description}</TableCell>
                          <TableCell>
                            <Link
                              to={report.url}
                              className="text-sm text-primary hover:underline font-medium"
                            >
                              View
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
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
