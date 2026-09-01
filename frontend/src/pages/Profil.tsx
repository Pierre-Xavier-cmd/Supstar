import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authentificationService } from "../services/authentification";
import { getErrorMessage } from "../services/api";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

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

  const [erreur, setErreur] = useState<string | null>(null);

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
    } catch (error: unknown) {
      setChargement(false);
      setErreur(getErrorMessage(error, "Token invalide"));
    }
  }, [navigate]);

  return (
    <div>
      <h1>Profil</h1>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        {erreur && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {erreur}
          </Alert>
        )}

        {chargement ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress aria-label="Loading…" />
          </Box>
        ) : (
          user && (
            <Card
              sx={{
                borderRadius: 5,
                overflow: "hidden",
                boxShadow: "0 20px 45px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #c97b63 0%, #f0b48a 55%, #f7d9b8 100%)",
                  px: 4,
                  py: 5,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#1f1f1f" }}
                >
                  {user.prenom} {user.nom}
                </Typography>

                <Typography variant="body1" sx={{ mt: 1, color: "#3b312c" }}>
                  {user.email}
                </Typography>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#faf7f2",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Identifiant
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.userId}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#faf7f2",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Préférences
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.preferences
                        ? JSON.stringify(user.preferences)
                        : "Aucune"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#faf7f2",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Créé à
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {new Date(user.iat * 1000).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#faf7f2",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Expire à
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {new Date(user.exp * 1000).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )
        )}
      </Container>
    </div>
  );
}

export default Profil;
