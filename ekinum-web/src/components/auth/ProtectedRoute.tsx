import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}