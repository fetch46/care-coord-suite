import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { userRole, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    // Role-based routing after authentication
    if (!loading && !roleLoading && user && userRole) {
      const currentPath = window.location.pathname;
      
      if (userRole === 'administrator') {
        // Super admin goes to super admin dashboard
        if (!currentPath.startsWith('/super-admin')) {
          navigate("/super-admin");
          return;
        }
      } else {
        // Tenant users go to main app
        if (currentPath.startsWith('/super-admin')) {
          navigate("/dashboard");
          return;
        }
      }
    }
  }, [user, loading, userRole, roleLoading, navigate]);

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