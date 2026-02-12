import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Pricing from "@/pages/Pricing";
import Landing from "@/pages/Landing";
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
import Billing from "./pages/Billing";
import CreateInvoice from "./pages/CreateInvoice";
import Payments from "./pages/Payments";
import FinancialReports from "./pages/FinancialReports";
import ScheduleDetails from "./pages/ScheduleDetails";
import Settings from "./pages/Settings";
import PatientEdit from "./pages/PatientEdit";
import PatientDischarge from "./pages/PatientDischarge";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import AssessmentReports from "./pages/AssessmentReports";
import StaffReports from "./pages/StaffReports";
import PatientReports from "./pages/PatientReports";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminClients from "./pages/SuperAdminClients";
import SuperAdminOrganizations from "./pages/SuperAdminOrganizations";
import SuperAdminOrganizationDetails from "./pages/SuperAdminOrganizationDetails";
import SuperAdminSettings from "./pages/SuperAdminSettings";
import SuperAdminCMS from "./pages/SuperAdminCMS";
import SuperAdminOrganizationSignups from "./pages/SuperAdminOrganizationSignups";
import SuperAdminSubscriptions from "./pages/SuperAdminSubscriptions";
import SuperAdminUserManagement from "./pages/SuperAdminUserManagement";
import SuperAdminSecurity from "./pages/SuperAdminSecurity";
import SuperAdminCommunication from "./pages/SuperAdminCommunication";
import OrganizationProfile from "./pages/OrganizationProfile";
import { SuperAdminLayout } from "./components/layouts/SuperAdminLayout";
import AdmissionsList from "./pages/AdmissionsList";
import PatientAdmission from "./pages/PatientAdmission";
import AssessmentView from "./pages/AssessmentView";
import SkinAssessmentView from "./pages/SkinAssessmentView";
import MedicalRecordView from "./pages/MedicalRecordView";
import MedicalRecordEdit from "./pages/MedicalRecordEdit";
import SuperAdminPackages from "./pages/SuperAdminPackages";
import SuperAdminCreateSubscription from "./pages/SuperAdminCreateSubscription";
import InvoiceView from "./pages/InvoiceView";
import InvoiceEdit from "./pages/InvoiceEdit";
import PaymentCreate from "./pages/PaymentCreate";
import PaymentView from "./pages/PaymentView";
import PaymentEdit from "./pages/PaymentEdit";
  
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
          <Route path="/pricing" element={<Pricing />} />
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
            <Route path="/admissions" element={<ProtectedRoute><AdmissionsList /></ProtectedRoute>} />
            <Route path="/patient-admission" element={<ProtectedRoute><PatientAdmission /></ProtectedRoute>} />
            <Route path="/skin-assessment" element={<ProtectedRoute><SkinAssessment /></ProtectedRoute>} />
            <Route path="/patient-assessment" element={<ProtectedRoute><PatientAssessment /></ProtectedRoute>} />
            <Route path="/assessments/:id" element={<ProtectedRoute><AssessmentView /></ProtectedRoute>} />
            <Route path="/skin-assessments/:id" element={<ProtectedRoute><SkinAssessmentView /></ProtectedRoute>} />
            <Route path="/medical-records/:id" element={<ProtectedRoute><MedicalRecordView /></ProtectedRoute>} />
            <Route path="/medical-records/:id/edit" element={<ProtectedRoute><MedicalRecordEdit /></ProtectedRoute>} />
            <Route path="/billing/invoice/:id" element={<ProtectedRoute><InvoiceView /></ProtectedRoute>} />
            <Route path="/billing/invoice/:id/edit" element={<ProtectedRoute><InvoiceEdit /></ProtectedRoute>} />
            <Route path="/payments/new" element={<ProtectedRoute><PaymentCreate /></ProtectedRoute>} />
            <Route path="/payments/:id" element={<ProtectedRoute><PaymentView /></ProtectedRoute>} />
            <Route path="/payments/:id/edit" element={<ProtectedRoute><PaymentEdit /></ProtectedRoute>} />
            <Route path="/digital-timesheet" element={<ProtectedRoute><DigitalTimesheet /></ProtectedRoute>} />
            <Route path="/timesheet-reports" element={<ProtectedRoute><TimesheetReports /></ProtectedRoute>} />
            <Route path="/timesheets" element={<ProtectedRoute><Timesheet /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/billing/invoice/new" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/financial-reports" element={<ProtectedRoute><FinancialReports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/organization-profile" element={<ProtectedRoute><OrganizationProfile /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/assessment-reports" element={<ProtectedRoute><AssessmentReports /></ProtectedRoute>} />
            <Route path="/staff-reports" element={<ProtectedRoute><StaffReports /></ProtectedRoute>} />
            <Route path="/patient-reports" element={<ProtectedRoute><PatientReports /></ProtectedRoute>} />
            <Route path="/super-admin" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/super-admin/organizations" element={<ProtectedRoute><SuperAdminOrganizations /></ProtectedRoute>} />
            <Route path="/super-admin/organizations/:id" element={<ProtectedRoute><SuperAdminOrganizationDetails /></ProtectedRoute>} />
            <Route path="/super-admin/organization-signups" element={<ProtectedRoute><SuperAdminOrganizationSignups /></ProtectedRoute>} />
            <Route path="/super-admin/packages" element={<ProtectedRoute><SuperAdminPackages /></ProtectedRoute>} />
            <Route path="/super-admin/subscriptions" element={<ProtectedRoute><SuperAdminSubscriptions /></ProtectedRoute>} />
            <Route path="/super-admin/subscriptions/create" element={<ProtectedRoute><SuperAdminCreateSubscription /></ProtectedRoute>} />
            <Route path="/super-admin/users" element={<ProtectedRoute><SuperAdminUserManagement /></ProtectedRoute>} />
            <Route path="/super-admin/settings" element={<ProtectedRoute><SuperAdminSettings /></ProtectedRoute>} />
            <Route path="/super-admin/security" element={<ProtectedRoute><SuperAdminSecurity /></ProtectedRoute>} />
            <Route path="/super-admin/communication" element={<ProtectedRoute><SuperAdminCommunication /></ProtectedRoute>} />
            <Route path="/super-admin/cms" element={<ProtectedRoute><SuperAdminCMS /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;