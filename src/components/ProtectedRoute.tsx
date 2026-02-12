import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { userRole, loading: roleLoading, isSuperAdmin } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    // Role-based routing after authentication
    if (!loading && !roleLoading && user && userRole) {
      const currentPath = window.location.pathname;
      
      // Non-super-admin users cannot access super-admin routes
      if (!isSuperAdmin && currentPath.startsWith('/super-admin')) {
        navigate("/dashboard");
        return;
      }
    }
  }, [user, loading, userRole, roleLoading, isSuperAdmin, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}