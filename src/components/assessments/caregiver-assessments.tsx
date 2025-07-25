import { useState, useEffect } from "react";
import { Plus, Calendar, User, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CaregiverAssessment {
  id: string;
  assessment_type: string;
  title: string;
  description: string;
  score: number;
  max_score: number;
  assessment_date: string;
  assessor_name: string;
  status: string;
  notes: string;
  recommendations: string;
  next_assessment_date: string;
}

interface CaregiverAssessmentsProps {
  caregiverId: string;
}

export function CaregiverAssessments({ caregiverId }: CaregiverAssessmentsProps) {
  const [assessments, setAssessments] = useState<CaregiverAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newAssessment, setNewAssessment] = useState({
    assessment_type: "",
    title: "",
    description: "",
    score: "",
    max_score: "",
    assessor_name: "",
    notes: "",
    recommendations: "",
    next_assessment_date: ""
  });

  useEffect(() => {
    fetchAssessments();
  }, [caregiverId]);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from("caregiver_assessments")
        .select("*")
        .eq("caregiver_id", caregiverId)
        .order("assessment_date", { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssessment = async () => {
    try {
      const { error } = await supabase.from("caregiver_assessments").insert({
        caregiver_id: caregiverId,
        assessment_type: newAssessment.assessment_type,
        title: newAssessment.title,
        description: newAssessment.description,
        score: newAssessment.score ? parseFloat(newAssessment.score) : null,
        max_score: newAssessment.max_score ? parseFloat(newAssessment.max_score) : null,
        assessed_by: "current-user-id", // In real app, use auth.uid()
        assessor_name: newAssessment.assessor_name,
        notes: newAssessment.notes,
        recommendations: newAssessment.recommendations,
        next_assessment_date: newAssessment.next_assessment_date || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment added successfully",
      });

      setIsAddDialogOpen(false);
      setNewAssessment({
        assessment_type: "",
        title: "",
        description: "",
        score: "",
        max_score: "",
        assessor_name: "",
        notes: "",
        recommendations: "",
        next_assessment_date: ""
      });
      fetchAssessments();
    } catch (error) {
      console.error("Error adding assessment:", error);
      toast({
        title: "Error",
        description: "Failed to add assessment",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading assessments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assessments</p>
                <p className="text-2xl font-bold">{assessments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Latest Score</p>
                <p className="text-2xl font-bold">
                  {assessments[0]?.score && assessments[0]?.max_score 
                    ? `${assessments[0].score}/${assessments[0].max_score}`
                    : "N/A"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">
                  {assessments.filter(a => a.next_assessment_date && new Date(a.next_assessment_date) > new Date()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Performance Assessments
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Assessment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assessment_type">Assessment Type</Label>
                      <Select value={newAssessment.assessment_type} onValueChange={(value) => 
                        setNewAssessment(prev => ({ ...prev, assessment_type: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Performance Review</SelectItem>
                          <SelectItem value="competency">Competency Assessment</SelectItem>
                          <SelectItem value="training">Training Evaluation</SelectItem>
                          <SelectItem value="skill">Skill Assessment</SelectItem>
                          <SelectItem value="annual">Annual Review</SelectItem>
                          <SelectItem value="probationary">Probationary Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        value={newAssessment.title}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Assessment title"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      value={newAssessment.description}
                      onChange={(e) => setNewAssessment(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Assessment description"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="score">Score</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newAssessment.score}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, score: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_score">Max Score</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newAssessment.max_score}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, max_score: e.target.value }))}
                        placeholder="100.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assessor_name">Assessor</Label>
                      <Input
                        value={newAssessment.assessor_name}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, assessor_name: e.target.value }))}
                        placeholder="Assessor name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      value={newAssessment.notes}
                      onChange={(e) => setNewAssessment(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Assessment notes"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recommendations">Recommendations</Label>
                    <Textarea
                      value={newAssessment.recommendations}
                      onChange={(e) => setNewAssessment(prev => ({ ...prev, recommendations: e.target.value }))}
                      placeholder="Recommendations for improvement"
                    />
                  </div>

                  <div>
                    <Label htmlFor="next_assessment_date">Next Assessment Date</Label>
                    <Input
                      type="date"
                      value={newAssessment.next_assessment_date}
                      onChange={(e) => setNewAssessment(prev => ({ ...prev, next_assessment_date: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAssessment}>
                      Add Assessment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {assessments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Assessor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Assessment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(assessment.assessment_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{assessment.assessment_type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{assessment.title}</TableCell>
                    <TableCell>
                      {assessment.score && assessment.max_score ? (
                        <span className={getScoreColor(assessment.score, assessment.max_score)}>
                          {assessment.score}/{assessment.max_score}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {assessment.assessor_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(assessment.status)}>
                        {assessment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {assessment.next_assessment_date ? (
                        new Date(assessment.next_assessment_date).toLocaleDateString()
                      ) : (
                        "Not scheduled"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No assessments found. Click "Add Assessment" to create the first one.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}