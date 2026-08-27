import { useNavigate } from "react-router-dom";
import { authentificationService } from "../services/authentification";
import { useEffect } from "react";

type DeconnexionProps = {
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

function Deconnexion({ setIsConnected }: DeconnexionProps): null {
  const navigate = useNavigate();

  useEffect(() => {
    authentificationService.logout();
    setIsConnected(false);
    navigate("/places");
  }, [navigate]);

  return null;
}

export default Deconnexion;
