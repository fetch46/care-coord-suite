import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, FileText, Clock, ClipboardList } from "lucide-react";

const reports = [
  {
    title: "Staff Reports",
    url: "/staff-reports",
    description: "View staff performance, attendance, and assignment details.",
    icon: <Users className="w-8 h-8 text-primary mb-2" />,
  },
  {
    title: "Assessment Reports",
    url: "/assessment-reports",
    description: "Analyze patient assessments, outcomes, and care recommendations.",
    icon: <ClipboardList className="w-8 h-8 text-primary mb-2" />,
  },
  {
    title: "Timesheet Reports",
    url: "/timesheet-reports",
    description: "Review submitted timesheets, overtime, and shift histories.",
    icon: <Clock className="w-8 h-8 text-primary mb-2" />,
  },
  {
    title: "Patient Reports",
    url: "/patient-reports",
    description: "Access individual patient histories, demographics, and medical records.",
    icon: <FileText className="w-8 h-8 text-primary mb-2" />,
  },
];

export default function Reports() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="p-8 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {reports.map((report) => (
              <Card key={report.title} className="flex flex-col justify-between h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {report.icon}
                    <CardTitle className="text-xl font-bold">
                      <Link to={report.url} className="hover:underline text-primary">
                        {report.title}
                      </Link>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{report.description}</p>
                </CardContent>
              </Card>
            ))}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
