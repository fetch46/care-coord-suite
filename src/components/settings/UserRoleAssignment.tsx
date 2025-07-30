import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface UserRoleAssignmentProps {
  onRoleAssigned: () => void;
}

export function UserRoleAssignment({ onRoleAssigned }: UserRoleAssignmentProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"administrator" | "reception" | "registered_nurse" | "caregiver" | "">("");

  const roleTypes = ["administrator", "reception", "registered_nurse", "caregiver"];

  const assignRole = async () => {
    if (!userId.trim() || !selectedRole) {
      toast({
        title: "Error",
        description: "Please provide both user ID and role",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: selectedRole as "administrator" | "reception" | "registered_nurse" | "caregiver" });
      
      if (error) throw error;
      
      setUserId("");
      setSelectedRole("");
      onRoleAssigned();
      
      toast({
        title: "Success",
        description: "Role assigned successfully"
      });
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Assign User Role
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user UUID"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={selectedRole} onValueChange={(value: "administrator" | "reception" | "registered_nurse" | "caregiver") => setSelectedRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roleTypes.map(role => (
                <SelectItem key={role} value={role} className="capitalize">
                  {role.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={assignRole} disabled={loading} className="w-full">
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Role
        </Button>
      </CardContent>
    </Card>
  );
}