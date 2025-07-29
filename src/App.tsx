import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Schedule from "./pages/Schedule";
import StaffDetails from "./pages/ScheduleDetails";
import PatientDetails from "./pages/PatientDetails";
import Staff from "./pages/Staff";
import StaffDetails from "./pages/StaffDetails";
import PatientRegistration from "./pages/PatientRegistration";
import Timesheet from "./pages/Timesheet";
import Assessments from "./pages/Assessments";
import SkinAssessment from "./pages/SkinAssessment";
import PatientAssessment from "./pages/PatientAssessment";
import DigitalTimesheet from "./pages/DigitalTimesheet";
import TimesheetReports from "./pages/TimesheetReports";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
  
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/:id" element={<StaffDetails />} />
          <Route path="/schedule" element={<ScheduleDetails />} />
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/skin-assessment" element={<SkinAssessment />} />
          <Route path="/patient-assessment" element={<PatientAssessment />} />
          <Route path="/digital-timesheet" element={<DigitalTimesheet />} />
          <Route path="/timesheet-reports" element={<TimesheetReports />} />
          <Route path="/timesheets" element={<Timesheet />} />
          <Route path="/reports" element={<Reports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
