import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authentificationService } from "../services/authentification";
import { Alert, CircularProgress } from "@mui/material";

type DecodedToken = {
  userId: string;
  email: string;
  nom: string;
  prenom: string;
  preferences?: Record<string, unknown>;
  iat: number;
  exp: number;
};

function Profil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<DecodedToken | null>(null);

  const [erreur, setErreur] = useState(null);

  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (!authentificationService.isConnected()) {
      navigate("/connexion");
      return;
    }

    try {
      setChargement(true);
      const token = localStorage.getItem("token") as string;
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
      setChargement(false);
    } catch (error: any) {
      //      console.error("Token invalide :", error);
      //      navigate("/connexion");
      // Qu'est ce qu'on fait ici ?
      setErreur(error);
    }
  }, [navigate]);

  return (
    <div>
      <h1>Profil</h1>

      {user && (
        <div>
          <p>Id : {user.userId}</p>
          <p>Prénom : {user.prenom}</p>
          <p>Nom : {user.nom}</p>
          <p>Email : {user.email}</p>
          <p>Préférences : {JSON.stringify(user.preferences) || "Aucune"}</p>
          <p>Créé à : {new Date(user.iat * 1000).toLocaleString()}</p>
          <p>Expire à : {new Date(user.exp * 1000).toLocaleString()}</p>
        </div>
      )}
      {erreur && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erreur}
        </Alert>
      )}
      {chargement && <CircularProgress aria-label="Loading…" />}
    </div>
  );
}

export default Profil;
