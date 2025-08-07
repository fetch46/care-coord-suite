import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Save, Eye, EyeOff, Plus, Edit, Image as ImageIcon, Code } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CMSContent {
  id?: string;
  content_key: string;
  content_type: "text" | "image" | "json";
  content_value: string | { text: string } | Record<string, unknown>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function SuperAdminCMS() {
  const [content, setContent] = useState<CMSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CMSContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isNewContent, setIsNewContent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .order("content_key");

      if (error) throw error;
      setContent((data || []) as CMSContent[]);
    } catch (error) {
      console.error("Error fetching CMS content:", error);
      toast({
        title: "Error",
        description: "Failed to load CMS content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (item: CMSContent) => {
    setSaving(true);
    try {
      if (isNewContent) {
        const { data, error } = await supabase.from("cms_content").insert([item]).select();
        if (error) throw error;
        setContent((prev) => [...prev, ...((data || []) as CMSContent[])]);
      } else {
        const { error } = await supabase
          .from("cms_content")
          .update({
            content_value: item.content_value,
            is_active: item.is_active,
            content_type: item.content_type,
          })
          .eq("id", item.id);

        if (error) throw error;

        setContent((prev) =>
          prev.map((c) => (c.id === item.id ? { ...c, ...item } : c))
        );
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setIsNewContent(false);

      toast({
        title: "Success",
        description: isNewContent ? "Content added successfully" : "Content updated successfully",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: CMSContent) => {
    const updated = { ...item, is_active: !item.is_active };
    setContent((prev) => prev.map((c) => (c.id === item.id ? updated : c)));

    try {
      const { error } = await supabase
        .from("cms_content")
        .update({ is_active: !item.is_active })
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Content ${!item.is_active ? "activated" : "deactivated"}`,
      });
    } catch (error) {
      console.error("Error toggling content:", error);
      toast({
        title: "Error",
        description: "Failed to toggle content status",
        variant: "destructive",
      });
    }
  };

  const formatContentKey = (key: string) =>
    key.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const openNewContentDialog = () => {
    setEditingItem({
      content_key: "",
      content_type: "text",
      content_value: { text: "" },
      is_active: true,
    });
    setIsNewContent(true);
    setIsDialogOpen(true);
  };

  const renderContentPreview = (item: CMSContent) => {
    switch (item.content_type) {
      case "image":
        return <img src={item.content_value.url} alt={item.content_key} className="w-full h-32 object-cover rounded" />;
      case "json":
        return <pre className="text-xs bg-muted p-2 rounded max-h-24 overflow-auto">{JSON.stringify(item.content_value, null, 2)}</pre>;
      default:
        return <p className="text-sm bg-muted p-2 rounded line-clamp-3">{item.content_value.text || ""}</p>;
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading CMS content...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground">
              Manage landing page content, images, and structured JSON data
            </p>
          </div>
          <Button onClick={openNewContentDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <Card key={item.id} className="relative hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{formatContentKey(item.content_key)}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch checked={item.is_active} onCheckedChange={() => handleToggleActive(item)} />
                    <Badge variant={item.is_active ? "default" : "secondary"}>
                      {item.is_active ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" /> Hidden
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>{renderContentPreview(item)}</div>

                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setEditingItem(item);
                    setIsNewContent(false);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit Content
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {content.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
              <p className="text-muted-foreground">There's no CMS content available yet.</p>
            </CardContent>
          </Card>
        )}

        {/* EDIT/ADD DIALOG */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{isNewContent ? "Add New Content" : `Edit ${editingItem?.content_key}`}</DialogTitle>
            </DialogHeader>

            {editingItem && (
              <div className="space-y-4">
                <div>
                  <Label>Content Key</Label>
                  <Input
                    value={editingItem.content_key}
                    onChange={(e) =>
                      setEditingItem((prev) => prev && { ...prev, content_key: e.target.value })
                    }
                    disabled={!isNewContent}
                  />
                </div>

                <div>
                  <Label>Content Type</Label>
                  <Tabs
                    value={editingItem.content_type}
                    onValueChange={(val) =>
                      setEditingItem((prev) => prev && { ...prev, content_type: val as CMSContent["content_type"], content_value: val === "text" ? { text: "" } : val === "image" ? { url: "" } : {} })
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="text"><FileText className="w-4 h-4 mr-1" /> Text</TabsTrigger>
                      <TabsTrigger value="image"><ImageIcon className="w-4 h-4 mr-1" /> Image</TabsTrigger>
                      <TabsTrigger value="json"><Code className="w-4 h-4 mr-1" /> JSON</TabsTrigger>
                    </TabsList>

                    <TabsContent value="text">
                      <Textarea
                        value={editingItem.content_value?.text || ""}
                        onChange={(e) =>
                          setEditingItem((prev) => prev && { ...prev, content_value: { text: e.target.value } })
                        }
                        rows={6}
                        placeholder="Enter content text..."
                      />
                    </TabsContent>

                    <TabsContent value="image">
                      <Input
                        placeholder="Image URL"
                        value={editingItem.content_value?.url || ""}
                        onChange={(e) =>
                          setEditingItem((prev) => prev && { ...prev, content_value: { url: e.target.value } })
                        }
                      />
                    </TabsContent>

                    <TabsContent value="json">
                      <Textarea
                        placeholder='Enter JSON content...'
                        value={JSON.stringify(editingItem.content_value || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditingItem((prev) => prev && { ...prev, content_value: parsed });
                          } catch {
                            // silently ignore invalid JSON until it's valid
                          }
                        }}
                        rows={8}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.is_active}
                    onCheckedChange={(checked) =>
                      setEditingItem((prev) => prev && { ...prev, is_active: checked })
                    }
                  />
                  <Label>Active (visible on website)</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => handleSave(editingItem)} disabled={saving} className="flex-1">
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    {isNewContent ? "Create Content" : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingItem(null);
                      setIsNewContent(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
}
