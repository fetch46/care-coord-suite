import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddUserToOrganizationProps {
  organizationId: string;
  organizationName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SuperAdminAddUserToOrganization({ 
  organizationId, 
  organizationName, 
  isOpen, 
  onClose, 
  onSuccess 
}: AddUserToOrganizationProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // First check if user exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
      // Create new user account
      const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";
      
      const { data: authData, error: authError } = await supabase.functions.invoke('password-reset', {
        body: {
          action: 'create-staff-user',
          email,
          password: tempPassword,
          firstName: email.split('@')[0],
          lastName: 'User',
          role: role,
          phone: ''
        }
      });

      if (authError) throw authError;

      // Add to organization
      const { error: orgError } = await supabase
        .from('organization_users')
        .insert({
          organization_id: organizationId,
          user_id: authData.userId,
          role: role as 'staff' | 'administrator' | 'reception' | 'registered_nurse' | 'caregiver' | 'owner' | 'admin',
          is_confirmed: true,
          confirmed_at: new Date().toISOString()
        });

      if (orgError) throw orgError;

      // Create staff record linking to organization
      const { error: staffError } = await supabase
        .from('staff')
        .insert({
          user_id: authData.userId,
          first_name: email.split('@')[0],
          last_name: 'User',
          email: email,
          role: role,
          status: 'Active'
        });

      if (staffError) console.error('Error creating staff record:', staffError);

        toast({
          title: "Success",
          description: `User created and added to ${organizationName}. Temporary password: ${tempPassword}`,
        });
      } else {
        // User exists, just add to organization
        const { error: orgError } = await supabase
          .from('organization_users')
          .insert({
            organization_id: organizationId,
            user_id: profileData.id,
            role: role as 'staff' | 'administrator' | 'reception' | 'registered_nurse' | 'caregiver' | 'owner' | 'admin',
            is_confirmed: true,
            confirmed_at: new Date().toISOString()
          });

        if (orgError) throw orgError;

        // Check if staff record exists, if not create one
        const { data: existingStaff, error: staffCheckError } = await supabase
          .from('staff')
          .select('id')
          .eq('user_id', profileData.id)
          .maybeSingle();

        if (staffCheckError) console.error('Error checking staff record:', staffCheckError);

        if (!existingStaff) {
          const { error: staffError } = await supabase
            .from('staff')
            .insert({
              user_id: profileData.id,
              first_name: email.split('@')[0],
              last_name: 'User',
              email: email,
              role: role,
              status: 'Active'
            });

          if (staffError) console.error('Error creating staff record:', staffError);
        }

        toast({
          title: "Success",
          description: `User added to ${organizationName}`,
        });
      }

      setEmail("");
      setRole("user");
      onClose();
      onSuccess();
    } catch (error: any) {
      console.error('Error adding user to organization:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add user to organization",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add User to Organization</DialogTitle>
          <DialogDescription>
            Add a new user to {organizationName}. If the user doesn't exist, a new account will be created.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="caregiver">Caregiver</SelectItem>
                <SelectItem value="registered_nurse">Registered Nurse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}