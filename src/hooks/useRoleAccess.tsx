import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface RolePermission {
  resource: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export function useRoleAccess() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        // Get user role
        const { data: userRoles, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (roleError) {
          console.error('Error fetching user roles:', roleError);
          setPermissions([]);
          setLoading(false);
          return;
        }

        if (!userRoles || userRoles.length === 0) {
          setPermissions([]);
          setLoading(false);
          return;
        }

        // Get permissions for user's role
        const userRole = userRoles[0]?.role;
        const { data: rolePermissions, error: permError } = await supabase
          .from('role_permissions')
          .select('resource, can_view, can_create, can_edit, can_delete')
          .eq('role', userRole);

        if (permError) {
          console.error('Error fetching role permissions:', permError);
          setPermissions([]);
        } else {
          setPermissions(rolePermissions || []);
        }
      } catch (error) {
        console.error('Error in fetchPermissions:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const hasPermission = (resource: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    const permission = permissions.find(p => p.resource === resource);
    if (!permission) return false;

    switch (action) {
      case 'view':
        return permission.can_view;
      case 'create':
        return permission.can_create;
      case 'edit':
        return permission.can_edit;
      case 'delete':
        return permission.can_delete;
      default:
        return false;
    }
  };

  return { hasPermission, loading };
}