import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus, Edit, Search } from "lucide-react";

interface AssessmentType {
  id: string;
  name: string;
  description: string;
  category?: string;
  is_active: boolean;
}

interface AssessmentTypesTabProps {
  assessmentTypes: AssessmentType[];
  onUpdate: (types: AssessmentType[]) => void;
  loading?: boolean;
}

export function AssessmentTypesTab({ assessmentTypes, onUpdate, loading = false }: AssessmentTypesTabProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<AssessmentType | null>(null);
  const [newType, setNewType] = useState<Partial<AssessmentType>>({
    name: "",
    description: "",
    category: "",
  });

  const filteredTypes = assessmentTypes.filter(type => 
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (type.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleAddType = async () => {
    if (!newType.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Assessment type name is required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const typeToInsert = {
        name: newType.name!,
        description: newType.description || null,
        category: newType.category || null,
        is_active: true,
      };
      
      const { data, error } = await supabase
        .from("assessment_types")
        .insert([typeToInsert])
        .select();
      
      if (error) throw error;
      
      if (data) {
        onUpdate([...assessmentTypes, data[0]]);
        setNewType({ name: "", description: "", category: "" });
        setIsAddDialogOpen(false);
        
        toast({
          title: "Assessment type added",
          description: `${data[0].name} has been added successfully.`,
        });
      }
    } catch (error) {
      console.error("Error adding assessment type:", error);
      toast({
        title: "Error",
        description: "Failed to add assessment type",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  const handleUpdateType = async () => {
    if (!editingType) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("assessment_types")
        .update({
          name: editingType.name,
          description: editingType.description,
          category: editingType.category,
        })
        .eq("id", editingType.id);
      
      if (error) throw error;
      
      onUpdate(assessmentTypes.map(t => 
        t.id === editingType.id ? editingType : t
      ));
      setEditingType(null);
      
      toast({
        title: "Assessment type updated",
        description: `${editingType.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating assessment type:", error);
      toast({
        title: "Error",
        description: "Failed to update assessment type",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  const handleToggleStatus = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from("assessment_types")
        .update({ is_active })
        .eq("id", id);
      
      if (error) throw error;
      
      onUpdate(assessmentTypes.map(t => 
        t.id === id ? { ...t, is_active } : t
      ));
      
      toast({
        title: is_active ? "Assessment type activated" : "Assessment type deactivated",
        description: `Status updated successfully.`,
      });
    } catch (error) {
      console.error("Error toggling status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stats
  const stats = {
    total: assessmentTypes.length,
    active: assessmentTypes.filter(t => t.is_active).length,
    inactive: assessmentTypes.filter(t => !t.is_active).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-muted-foreground">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Types Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Assessment Types</CardTitle>
              </div>
              <CardDescription>
                Configure the types of assessments available in the system
              </CardDescription>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Assessment Type</DialogTitle>
                  <DialogDescription>
                    Create a new assessment type for clinical evaluations
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type_name">Name *</Label>
                    <Input
                      id="type_name"
                      placeholder="e.g., Fall Risk Assessment"
                      value={newType.name || ""}
                      onChange={(e) => setNewType({...newType, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type_category">Category</Label>
                    <Input
                      id="type_category"
                      placeholder="e.g., Safety, Clinical, Cognitive"
                      value={newType.category || ""}
                      onChange={(e) => setNewType({...newType, category: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type_description">Description</Label>
                    <Textarea
                      id="type_description"
                      placeholder="Describe the purpose of this assessment type..."
                      value={newType.description || ""}
                      onChange={(e) => setNewType({...newType, description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddType} disabled={saving}>
                    {saving ? "Adding..." : "Add Type"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessment types..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          {filteredTypes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No assessment types found</p>
              <p className="text-sm">Add an assessment type to get started</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        {type.category ? (
                          <Badge variant="outline">{type.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {type.description || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={type.is_active}
                            onCheckedChange={(checked) => handleToggleStatus(type.id, checked)}
                          />
                          <Badge variant={type.is_active ? "default" : "secondary"}>
                            {type.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog open={editingType?.id === type.id} onOpenChange={(open) => !open && setEditingType(null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingType(type)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Assessment Type</DialogTitle>
                              <DialogDescription>
                                Update the assessment type details
                              </DialogDescription>
                            </DialogHeader>
                            {editingType && (
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit_name">Name *</Label>
                                  <Input
                                    id="edit_name"
                                    value={editingType.name}
                                    onChange={(e) => setEditingType({...editingType, name: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit_category">Category</Label>
                                  <Input
                                    id="edit_category"
                                    value={editingType.category || ""}
                                    onChange={(e) => setEditingType({...editingType, category: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit_description">Description</Label>
                                  <Textarea
                                    id="edit_description"
                                    value={editingType.description || ""}
                                    onChange={(e) => setEditingType({...editingType, description: e.target.value})}
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingType(null)}>Cancel</Button>
                              <Button onClick={handleUpdateType} disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
