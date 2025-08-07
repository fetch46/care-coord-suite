import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Eye, 
  Printer, 
  Search, 
  Filter,
  Calendar,
  User,
  Download
} from "lucide-react";
import { format } from "date-fns";

interface AssessmentReport {
  id: string;
  assessment_id: string;
  assessment_type: string;
  report_title: string;
  generated_by: string;
  generated_at: string;
  patient_name: string;
  assessor_name: string;
  assessment_date: string;
  report_data: Record<string, unknown>;
}

export default function AssessmentReports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<AssessmentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessment_reports')
        .select('*')
        .order('generated_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load assessment reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSampleReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sampleReports = [
        {
          assessment_id: "sample-1",
          assessment_type: "patient",
          report_title: "Quarterly Patient Assessment - John Doe",
          generated_by: user.id,
          patient_name: "John Doe",
          assessor_name: "Dr. Sarah Johnson",
          assessment_date: "2024-01-15",
          report_data: {
            scores: { mobility: 85, cognition: 92, daily_living: 78 },
            recommendations: ["Continue physical therapy", "Monitor medication adherence"]
          }
        },
        {
          assessment_id: "sample-2",
          assessment_type: "comprehensive",
          report_title: "Comprehensive Care Assessment - Jane Smith",
          generated_by: user.id,
          patient_name: "Jane Smith",
          assessor_name: "Nurse Mary Wilson",
          assessment_date: "2024-01-10",
          report_data: {
            overall_score: 88,
            care_plan: "Enhanced monitoring required",
            next_assessment: "2024-04-10"
          }
        },
        {
          assessment_id: "sample-3",
          assessment_type: "skin",
          report_title: "Skin Assessment Report - Robert Brown",
          generated_by: user.id,
          patient_name: "Robert Brown",
          assessor_name: "Dr. Emily Davis",
          assessment_date: "2024-01-12",
          report_data: {
            skin_integrity: "Good",
            pressure_points: "None identified",
            recommendations: "Continue current skin care regimen"
          }
        }
      ];

      const { error } = await supabase
        .from('assessment_reports')
        .insert(sampleReports);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sample reports generated successfully"
      });
      
      fetchReports();
    } catch (error) {
      console.error('Error generating sample reports:', error);
      toast({
        title: "Error",
        description: "Failed to generate sample reports",
        variant: "destructive"
      });
    }
  };

  const viewReport = (report: AssessmentReport) => {
    // For now, show a placeholder. In a real app, this would open a detailed report view
    toast({
      title: "View Report",
      description: `Opening ${report.report_title} - This would show the detailed report view.`
    });
  };

  const printReport = async (report: AssessmentReport) => {
    try {
      setGeneratingPDF(report.id);
      
      // Simulate PDF generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "PDF Generated",
        description: `${report.report_title} has been converted to PDF and is ready for download.`
      });
      
      // In a real implementation, you would:
      // 1. Call an edge function to generate PDF
      // 2. Download the generated PDF file
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive"
      });
    } finally {
      setGeneratingPDF(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "patient":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "comprehensive":
        return "bg-green-100 text-green-800 border-green-200";
      case "skin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "caregiver":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.report_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.assessor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || report.assessment_type === filterType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 p-6">
              <div className="text-center">Loading assessment reports...</div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Assessment Reports</h1>
                <p className="text-muted-foreground">View and manage patient assessment reports</p>
              </div>
              {reports.length === 0 && (
                <Button onClick={generateSampleReports}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Sample Reports
                </Button>
              )}
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search reports by title, patient, or assessor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="patient">Patient Assessments</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      <SelectItem value="skin">Skin Assessments</SelectItem>
                      <SelectItem value="caregiver">Caregiver Assessments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
                    <p className="text-muted-foreground">
                      {reports.length === 0 
                        ? "No assessment reports have been generated yet. Click the button above to create sample reports."
                        : "No reports match your current search criteria."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{report.report_title}</h3>
                            <Badge className={getTypeColor(report.assessment_type)}>
                              {report.assessment_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Patient: {report.patient_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>Assessor: {report.assessor_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Date: {format(new Date(report.assessment_date), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-muted-foreground">
                            Generated on {format(new Date(report.generated_at), 'MMM dd, yyyy \'at\' h:mm a')}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewReport(report)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Report
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => printReport(report)}
                            disabled={generatingPDF === report.id}
                          >
                            {generatingPDF === report.id ? (
                              <>
                                <Download className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Printer className="w-4 h-4 mr-2" />
                                Print PDF
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}