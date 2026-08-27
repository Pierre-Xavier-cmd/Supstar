import { Navigate } from "react-router-dom";
import { authentificationService } from "../services/authentification";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!authentificationService.isConnected()) {
    return <Navigate to="/connexion" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
