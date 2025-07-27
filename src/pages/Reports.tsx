import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const reports = [
  { title: "Staff Reports", url: "/staff-reports" },
  { title: "Assessment Reports", url: "/assessment-reports" },
  { title: "Timesheet Reports", url: "/timesheet-reports" },
  { title: "Patient Reports", url: "/patient-reports" },
];

export default function Reports() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="p-8 flex flex-col items-center">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Available Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {reports.map((report) => (
                    <li key={report.title}>
                      <Link
                        to={report.url}
                        className="text-lg font-semibold text-primary hover:underline"
                      >
                        {report.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
