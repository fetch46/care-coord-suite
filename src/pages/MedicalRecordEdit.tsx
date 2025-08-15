import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MedicalRecord {
  id: string;
  title: string;
  description?: string;
  recorded_date: string;
  recorded_by?: string;
  is_confidential: boolean;
  record_type: string;
}

export default function MedicalRecordEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRecord();
    }
  }, [id]);

  const fetchRecord = async () => {
    try {
      const { data, error } = await supabase
        .from("medical_records")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setRecord(data);
    } catch (error) {
      console.error("Error fetching medical record:", error);
      toast({
        title: "Error",
        description: "Failed to load medical record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!record) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("medical_records")
        .update({
          title: record.title,
          description: record.description,
          recorded_date: record.recorded_date,
          recorded_by: record.recorded_by,
          is_confidential: record.is_confidential,
          record_type: record.record_type,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medical record updated successfully",
      });

      navigate(`/medical-records/${id}`);
    } catch (error) {
      console.error("Error updating medical record:", error);
      toast({
        title: "Error",
        description: "Failed to update medical record",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/medical-records/${id}`}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Record
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold">Edit Medical Record</h1>
                    <p className="text-muted-foreground">{record.title}</p>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>

              {/* Edit Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Record Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={record.title}
                        onChange={(e) => setRecord({ ...record, title: e.target.value })}
                        placeholder="Record title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="record_type">Record Type</Label>
                      <Select
                        value={record.record_type}
                        onValueChange={(value) => setRecord({ ...record, record_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assessment">Assessment</SelectItem>
                          <SelectItem value="diagnosis">Diagnosis</SelectItem>
                          <SelectItem value="treatment">Treatment</SelectItem>
                          <SelectItem value="progress_note">Progress Note</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="lab_result">Lab Result</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="recorded_date">Record Date</Label>
                      <Input
                        id="recorded_date"
                        type="date"
                        value={record.recorded_date}
                        onChange={(e) => setRecord({ ...record, recorded_date: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="recorded_by">Recorded By</Label>
                      <Input
                        id="recorded_by"
                        value={record.recorded_by || ""}
                        onChange={(e) => setRecord({ ...record, recorded_by: e.target.value })}
                        placeholder="Healthcare provider name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={record.description || ""}
                      onChange={(e) => setRecord({ ...record, description: e.target.value })}
                      placeholder="Detailed record description..."
                      rows={6}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="confidential"
                      checked={record.is_confidential}
                      onCheckedChange={(checked) => setRecord({ ...record, is_confidential: checked })}
                    />
                    <Label htmlFor="confidential">Mark as confidential</Label>
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