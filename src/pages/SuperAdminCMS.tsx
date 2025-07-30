import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface CMSContent {
  id: string;
  content_key: string;
  content_type: string;
  content_value: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function SuperAdminCMS() {
  const [content, setContent] = useState<CMSContent[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [saving, setSaving] = useState(false);
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
      setContent(data || []);
      if (data && data.length > 0) {
        setActiveTab(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching CMS content:", error);
      toast({
        title: "Error",
        description: "Failed to load CMS content",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (item: CMSContent) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("cms_content")
        .update({
          content_value: item.content_value,
          is_active: item.is_active,
        })
        .eq("id", item.id);

      if (error) throw error;

      await fetchContent();

      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      console.error("Error updating content:", error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: CMSContent) => {
    try {
      const { error } = await supabase
        .from("cms_content")
        .update({ is_active: !item.is_active })
        .eq("id", item.id);

      if (error) throw error;
      await fetchContent();

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

  const updateItemLocally = (id: string, updates: Partial<CMSContent>) => {
    setContent((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const formatContentKey = (key: string) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Content Management System</h1>
        <p className="text-muted-foreground mb-4">
          Manage landing page content and other dynamic text elements
        </p>

        {content.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No CMS content found.</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Vertical Tabs List */}
            <TabsList className="flex md:flex-col gap-1 overflow-auto col-span-1 border p-2 rounded">
              {content.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="justify-start">
                  {formatContentKey(item.content_key)}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tabs Content Panel */}
            <div className="col-span-1 md:col-span-3">
              {content.map((item) => (
                <TabsContent key={item.id} value={item.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {formatContentKey(item.content_key)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={item.content_value?.text || ""}
                          onChange={(e) =>
                            updateItemLocally(item.id, {
                              content_value: { text: e.target.value },
                            })
                          }
                          rows={6}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={(checked) =>
                            updateItemLocally(item.id, {
                              is_active: checked,
                            })
                          }
                        />
                        <Label>Active (visible on site)</Label>
                        <Badge variant={item.is_active ? "default" : "secondary"}>
                          {item.is_active ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Hidden
                            </>
                          )}
                        </Badge>
                      </div>

                      <Button
                        onClick={() => handleSave(item)}
                        disabled={saving}
                      >
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}
      </div>
    </SuperAdminLayout>
  );
}
