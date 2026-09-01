import { useEffect, useState } from "react";
import api, { messageErreur } from "../services/api";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { authentificationService } from "../services/authentification";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

type ConnexionProps = {
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

function Connexion({ setIsConnected }: ConnexionProps) {
  const [form, setForm] = useState({
    email: "",
    motDePasse: "",
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

    try {
      setChargement(true);
      const res = await api.post("/users/connexion", form);
      localStorage.setItem("token", res.data.token);
      setIsConnected(true);
      setChargement(false);
      navigate("/liste-lieux");
    } catch (error: unknown) {
      setChargement(false);
      setErreur(messageErreur(error, "Erreur de connexion"));
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
            Connexion
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Connectez-vous pour accéder à votre espace.
          </Typography>

          {erreur && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erreur}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={chargement}
              sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
            >
              {chargement ? (
                <CircularProgress aria-label="Loading…" />
              ) : (
                "Connexion"
              )}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            Vous n'êtes pas encore inscrit ?
            <Link component={RouterLink} to="/inscription" underline="hover">
              Inscription
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Connexion;
