import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Platform super admin roles that have access to /super-admin routes
const SUPER_ADMIN_ROLES = ['administrator', 'admin', 'owner'];

// Organization-level roles
const ORG_ROLES = ['owner', 'admin', 'staff', 'reception', 'registered_nurse', 'caregiver'];

export function useUserRole() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        } else {
          setUserRole(data?.role || null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Helper to check if user is a platform super admin
  const isSuperAdmin = SUPER_ADMIN_ROLES.includes(userRole || '');
  
  // Helper to check if user has an org-level role
  const isOrgUser = ORG_ROLES.includes(userRole || '') && !isSuperAdmin;

  return { userRole, loading, isSuperAdmin, isOrgUser };
}