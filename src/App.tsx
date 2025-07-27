import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import Staff from "./pages/Staff";
import StaffDetails from "./pages/StaffDetails";
import PatientRegistration from "./pages/PatientRegistration";
import Timesheet from "./pages/Timesheet";
import DigitalTimesheet from "./pages/DigitalTimesheet";
import TimesheetReports from "./pages/TimesheetReports";
import NotFound from "./pages/NotFound";

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
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/:id" element={<StaffDetails />} />
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/digital-timesheet" element={<DigitalTimesheet />} />
          <Route path="/timesheet-reports" element={<TimesheetReports />} />
          <Route path="/reports" element={<Reports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
