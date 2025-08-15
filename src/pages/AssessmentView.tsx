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

interface Assessment {
  id: string;
  patient_id: string;
  assessment_type: string;
  title: string;
  description?: string;
  assessment_date: string;
  assessor_name: string;
  status: string;
  score?: number;
  max_score?: number;
  notes?: string;
  recommendations?: string;
  patient?: {
    first_name: string;
    last_name: string;
  } | null;
}

export default function AssessmentView() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAssessment();
    }
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const { data, error } = await supabase
        .from("patient_assessments")
        .select(`
          *,
          patient:patients(first_name, last_name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setAssessment(data as unknown as Assessment);
      }
    } catch (error) {
      console.error("Error fetching assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "in_progress":
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
                <div>Loading assessment...</div>
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
                <div>Assessment not found</div>
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
                        <CardTitle className="text-2xl">{assessment.title}</CardTitle>
                        <p className="text-muted-foreground">
                          {assessment.assessment_type} Assessment
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
                          {new Date(assessment.assessment_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Assessor</p>
                        <p className="font-semibold">{assessment.assessor_name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  {assessment.score !== null && assessment.max_score && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Assessment Score</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {assessment.score}
                        </span>
                        <span className="text-muted-foreground">
                          / {assessment.max_score}
                        </span>
                        <div className="ml-4 flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(assessment.score / assessment.max_score) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {assessment.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {assessment.description}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {assessment.notes && (
                    <div>
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="leading-relaxed">{assessment.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {assessment.recommendations && (
                    <div>
                      <h3 className="font-semibold mb-2">Recommendations</h3>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="leading-relaxed text-blue-900">
                          {assessment.recommendations}
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