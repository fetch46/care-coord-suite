import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, FileText, Printer } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface SkinAssessment {
  id: string;
  patient_id: string;
  assessment_date?: string;
  skin_condition?: string;
  pressure_ulcer_risk?: string;
  notes?: string;
  status: string;
  body_map_data?: any;
  patient?: {
    first_name: string;
    last_name: string;
  };
}

export default function SkinAssessmentView() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState<SkinAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAssessment();
    }
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const { data, error } = await supabase
        .from("skin_assessments")
        .select(`
          *,
          patient:patients(first_name, last_name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setAssessment(data);
    } catch (error) {
      console.error("Error fetching skin assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "draft":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-full">
                <div>Loading skin assessment...</div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!assessment) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-full">
                <div>Skin assessment not found</div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/assessments">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Assessments
                  </Link>
                </Button>
              </div>

              {/* Assessment Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="w-6 h-6 text-primary" />
                      <div>
                        <CardTitle className="text-2xl">Skin Assessment</CardTitle>
                        <p className="text-muted-foreground">
                          Comprehensive skin integrity evaluation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(assessment.status)}>
                        {assessment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Patient & Assessment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Patient</p>
                        <p className="font-semibold">
                          {assessment.patient?.first_name} {assessment.patient?.last_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Assessment Date</p>
                        <p className="font-semibold">
                          {assessment.assessment_date ? new Date(assessment.assessment_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Skin Condition</p>
                        <p className="font-semibold">{assessment.skin_condition || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pressure Ulcer Risk */}
                  {assessment.pressure_ulcer_risk && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Pressure Ulcer Risk</h3>
                      <p>{assessment.pressure_ulcer_risk}</p>
                    </div>
                  )}

                  {/* Body Map Data */}
                  {assessment.body_map_data && (
                    <div>
                      <h3 className="font-semibold mb-4">Body Diagram Annotations</h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Interactive body diagram with marked areas of concern
                        </p>
                        <div className="bg-white border rounded p-4">
                          <p className="text-center text-muted-foreground">
                            Body diagram visualization would be displayed here
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {assessment.notes && (
                    <div>
                      <h3 className="font-semibold mb-2">General Notes</h3>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="leading-relaxed text-blue-900">
                          {assessment.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}