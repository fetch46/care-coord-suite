import { useState } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, FileText, Clock, ClipboardList } from "lucide-react";

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
          <AppHeader />
          <main className="p-8">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Reports</h1>
                  <Input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
