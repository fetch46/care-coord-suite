import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Save } from "lucide-react";

interface RolePermission {
  id: string;
  role: string;
  resource: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

interface RolePermissionsProps {
  onPermissionsUpdate?: () => void;
}

export function RolePermissions({ onPermissionsUpdate }: RolePermissionsProps) {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const roles = ["administrator", "reception", "registered_nurse", "caregiver"];
  const resources = [
    "patients",
    "staff", 
    "medical_records",
    "appointments",
    "assessments",
    "timesheets",
    "reports",
    "settings"
  ];

  const permissionTypes = [
    { key: "can_view", label: "View" },
    { key: "can_create", label: "Create" },
    { key: "can_edit", label: "Edit" },
    { key: "can_delete", label: "Delete" }
  ];

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .order('role')
        .order('resource');

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast({
        title: "Error",
        description: "Failed to load role permissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (permissionId: string, field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from('role_permissions')
        .update({ [field]: value })
        .eq('id', permissionId);

      if (error) throw error;

      // Update local state
      setPermissions(prev => 
        prev.map(p => 
          p.id === permissionId ? { ...p, [field]: value } : p
        )
      );
    } catch (error) {
      console.error('Error updating permission:', error);
      toast({
        title: "Error",
        description: "Failed to update permission.",
        variant: "destructive",
      });
    }
  };

  const saveAllPermissions = async () => {
    try {
      setSaving(true);
      
      const updates = permissions.map(permission => ({
        id: permission.id,
        can_view: permission.can_view,
        can_create: permission.can_create,
        can_edit: permission.can_edit,
        can_delete: permission.can_delete
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('role_permissions')
          .update(update)
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "All permissions saved successfully.",
      });

      onPermissionsUpdate?.();
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Error",
        description: "Failed to save permissions.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getRolePermission = (role: string, resource: string) => {
    return permissions.find(p => p.role === role && p.resource === resource);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "administrator":
        return "bg-red-100 text-red-800 border-red-200";
      case "reception":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "registered_nurse":
        return "bg-green-100 text-green-800 border-green-200";
      case "caregiver":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading permissions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role Permissions
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure what each role can do with different resources
          </p>
        </div>
        <Button onClick={saveAllPermissions} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs defaultValue="administrator" orientation="vertical" className="flex gap-6">
        <TabsList className="flex flex-col h-fit w-48 gap-2 border rounded-md p-2 bg-muted/30">
          {roles.map(role => (
            <TabsTrigger 
              key={role} 
              value={role} 
              className="justify-start w-full"
            >
              <Badge className={`${getRoleColor(role)} mr-2 text-xs`}>
                {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1">
          {roles.map(role => (
            <TabsContent key={role} value={role} className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className={getRoleColor(role)}>
                      {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Resource</th>
                          {permissionTypes.map(type => (
                            <th key={type.key} className="text-center p-3 font-medium">
                              {type.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map(resource => {
                          const permission = getRolePermission(role, resource);
                          if (!permission) return null;

                          return (
                            <tr key={resource} className="border-b hover:bg-muted/30">
                              <td className="p-3 font-medium capitalize">
                                {resource.replace('_', ' ')}
                              </td>
                              {permissionTypes.map(type => (
                                <td key={type.key} className="p-3 text-center">
                                  <Checkbox
                                    checked={permission[type.key as keyof RolePermission] as boolean}
                                    onCheckedChange={(checked) => 
                                      updatePermission(permission.id, type.key, checked as boolean)
                                    }
                                  />
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}