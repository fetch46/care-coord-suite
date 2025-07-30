import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Save, Eye, EyeOff, Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CMSContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .order('content_key');

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching CMS content:', error);
      toast({
        title: "Error",
        description: "Failed to load CMS content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (item: CMSContent) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('cms_content')
        .update({
          content_value: item.content_value,
          is_active: item.is_active
        })
        .eq('id', item.id);

      if (error) throw error;

      await fetchContent();
      setIsDialogOpen(false);
      setEditingItem(null);
      
      toast({
        title: "Success",
        description: "Content updated successfully"
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: CMSContent) => {
    try {
      const { error } = await supabase
        .from('cms_content')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      await fetchContent();
      
      toast({
        title: "Success",
        description: `Content ${!item.is_active ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      console.error('Error toggling content:', error);
      toast({
        title: "Error",
        description: "Failed to toggle content status",
        variant: "destructive"
      });
    }
  };

  const formatContentKey = (key: string) => {
    return key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
            <h1 className="text-3xl font-bold">Content Management System</h1>
            <p className="text-muted-foreground">
              Manage landing page content and other dynamic text elements
            </p>
          </div>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <Card key={item.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{formatContentKey(item.content_key)}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={() => handleToggleActive(item)}
                    />
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
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Current Content:</p>
                  <p className="text-sm bg-muted p-2 rounded line-clamp-3">
                    {item.content_value.text || JSON.stringify(item.content_value)}
                  </p>
                </div>
                
                <Dialog 
                  open={isDialogOpen && editingItem?.id === item.id} 
                  onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingItem(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => setEditingItem({ ...item })}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Content
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit {formatContentKey(item.content_key)}</DialogTitle>
                    </DialogHeader>
                    
                    {editingItem && (
                      <div className="space-y-4">
                        <div>
                          <Label>Content Key</Label>
                          <Input value={editingItem.content_key} disabled />
                        </div>
                        
                        <div>
                          <Label>Content</Label>
                          <Textarea
                            value={editingItem.content_value.text || ''}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              content_value: { text: e.target.value }
                            })}
                            rows={6}
                            placeholder="Enter content text..."
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={editingItem.is_active}
                            onCheckedChange={(checked) => setEditingItem({
                              ...editingItem,
                              is_active: checked
                            })}
                          />
                          <Label>Active (visible on website)</Label>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <Button 
                            onClick={() => handleSave(editingItem)}
                            disabled={saving}
                            className="flex-1"
                          >
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsDialogOpen(false);
                              setEditingItem(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {content.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
              <p className="text-muted-foreground">
                There's no CMS content available at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </SuperAdminLayout>
  );
}