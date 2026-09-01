import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { authentificationService } from "../services/authentification";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

type ConnexionProps = {
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

function Inscription({ setIsConnected }: ConnexionProps) {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    motDePasse: "",
    confirmeMotDePasse: "",
  });

  const [erreur, setErreur] = useState<string | null>(null);

  const [chargement, setChargement] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (authentificationService.isConnected()) {
      navigate("/liste-lieux");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.motDePasse !== form.confirmeMotDePasse) {
      setErreur("Les deux mots de passe ne sont pas identiques");
      return;
    }

    try {
      setChargement(true);
      const res = await api.post("/users/inscription", form);
      localStorage.setItem("token", res.data.token);
      setIsConnected(true);
      setChargement(false);
      navigate("/liste-lieux");

      alert("Inscription réussie");
    } catch (error: unknown) {
      setChargement(false);
      setErreur(getErrorMessage(error, "Erreur lors de l'inscription"));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Inscription
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Créez votre compte pour continuer.
          </Typography>

          {erreur && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erreur}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Prénom"
              margin="normal"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            />

            <TextField
              fullWidth
              label="Nom"
              margin="normal"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              margin="normal"
              value={form.motDePasse}
              onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
            />

            <TextField
              fullWidth
              label="Confirmation du mot de passe"
              type="password"
              margin="normal"
              value={form.confirmeMotDePasse}
              onChange={(e) =>
                setForm({ ...form, confirmeMotDePasse: e.target.value })
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
            >
              {chargement ? "Chargement..." : "S'inscrire"}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            Vous avez déjà un compte ?{" "}
            <Link component={RouterLink} to="/connexion" underline="hover">
              Connexion
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Inscription;
