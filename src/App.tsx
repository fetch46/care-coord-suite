import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Patients from "./pages/Patients";
import Schedule from "./pages/Schedule";
import PatientDetails from "./pages/PatientDetails";
import MedicalRecords from "./pages/MedicalRecords";
import MedicalRecordForm from "./pages/MedicalRecordForm";
import Staff from "./pages/Staff";
import StaffDetails from "./pages/StaffDetails";
import PatientRegistration from "./pages/PatientRegistration";
import Timesheet from "./pages/Timesheet";
import Assessments from "./pages/Assessments";
import SkinAssessment from "./pages/SkinAssessment";
import PatientAssessment from "./pages/PatientAssessment";
import DigitalTimesheet from "./pages/DigitalTimesheet";
import TimesheetReports from "./pages/TimesheetReports";
import CreateSchedule from "./pages/CreateSchedule";
import ScheduleDetails from "./pages/ScheduleDetails";
import Settings from "./pages/Settings";
import PatientEdit from "./pages/PatientEdit";
import PatientDischarge from "./pages/PatientDischarge";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import AssessmentReports from "./pages/AssessmentReports";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminClients from "./pages/SuperAdminClients";
import SuperAdminSettings from "./pages/SuperAdminSettings";
import { SuperAdminLayout } from "./components/layouts/SuperAdminLayout";
  
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
            <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
            <Route path="/medical-records/new" element={<ProtectedRoute><MedicalRecordForm /></ProtectedRoute>} />
            <Route path="/medical-records/:id/edit" element={<ProtectedRoute><MedicalRecordForm /></ProtectedRoute>} />
            <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
            <Route path="/schedules/new" element={<ProtectedRoute><CreateSchedule /></ProtectedRoute>} />
            <Route path="/schedule/:id" element={<ProtectedRoute><ScheduleDetails /></ProtectedRoute>} />
            <Route path="/patients/:id" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
            <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientEdit /></ProtectedRoute>} />
            <Route path="/patients/:id/discharge" element={<ProtectedRoute><PatientDischarge /></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
            <Route path="/staff/:id" element={<ProtectedRoute><StaffDetails /></ProtectedRoute>} />
            <Route path="/patient-registration" element={<ProtectedRoute><PatientRegistration /></ProtectedRoute>} />
            <Route path="/skin-assessment" element={<ProtectedRoute><SkinAssessment /></ProtectedRoute>} />
            <Route path="/patient-assessment" element={<ProtectedRoute><PatientAssessment /></ProtectedRoute>} />
            <Route path="/digital-timesheet" element={<ProtectedRoute><DigitalTimesheet /></ProtectedRoute>} />
            <Route path="/timesheet-reports" element={<ProtectedRoute><TimesheetReports /></ProtectedRoute>} />
            <Route path="/timesheets" element={<ProtectedRoute><Timesheet /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/assessment-reports" element={<ProtectedRoute><AssessmentReports /></ProtectedRoute>} />
            <Route path="/super-admin" element={<ProtectedRoute><SuperAdminLayout><SuperAdminDashboard /></SuperAdminLayout></ProtectedRoute>} />
            <Route path="/super-admin/clients" element={<ProtectedRoute><SuperAdminLayout><SuperAdminClients /></SuperAdminLayout></ProtectedRoute>} />
            <Route path="/super-admin/settings" element={<ProtectedRoute><SuperAdminLayout><SuperAdminSettings /></SuperAdminLayout></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;