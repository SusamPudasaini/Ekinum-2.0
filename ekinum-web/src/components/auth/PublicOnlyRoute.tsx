import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type PublicOnlyRouteProps = {
  children: React.ReactNode;
};

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}