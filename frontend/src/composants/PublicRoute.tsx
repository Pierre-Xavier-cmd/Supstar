import { Navigate } from "react-router-dom";
import { authentificationService } from "../services/authentification";

type PublicRouteProps = {
  children: React.ReactNode;
};

function PublicRoute({ children }: PublicRouteProps) {
  if (authentificationService.isConnected()) {
    return <Navigate to="/places" replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
