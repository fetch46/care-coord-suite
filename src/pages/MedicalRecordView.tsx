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

interface MedicalRecord {
  id: string;
  patient_id: string;
  title: string;
  description?: string;
  recorded_date: string;
  recorded_by?: string;
  is_confidential: boolean;
  record_type: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
}

export default function MedicalRecordView() {
  const { id } = useParams();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRecord();
    }
  }, [id]);

  const fetchRecord = async () => {
    try {
      const { data, error } = await supabase
        .from("medical_records")
        .select(`
          *,
          patient:patients(first_name, last_name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setRecord(data);
    } catch (error) {
      console.error("Error fetching medical record:", error);
    } finally {
      setLoading(false);
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
                <div>Loading medical record...</div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!record) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-full">
                <div>Medical record not found</div>
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
                  <Link to="/medical-records">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Medical Records
                  </Link>
                </Button>
              </div>

              {/* Record Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="w-6 h-6 text-primary" />
                      <div>
                        <CardTitle className="text-2xl">{record.title}</CardTitle>
                        <p className="text-muted-foreground">
                          {record.record_type} Medical Record
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {record.is_confidential && (
                        <Badge variant="destructive">Confidential</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Patient & Record Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Patient</p>
                        <p className="font-semibold">
                          {record.patient?.first_name} {record.patient?.last_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Record Date</p>
                        <p className="font-semibold">
                          {new Date(record.recorded_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Recorded By</p>
                        <p className="font-semibold">{record.recorded_by || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {record.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="leading-relaxed">{record.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button asChild>
                      <Link to={`/medical-records/${id}/edit`}>
                        Edit Record
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`/patients/${record.patient_id}`}>
                        View Patient
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}