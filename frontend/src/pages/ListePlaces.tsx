import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authentificationService } from "../services/authentification";

type Liste = {
  _id: string;
  nom: string;
  createur?: string;
  membres: {
    user: string;
    role: string;
  }[];
  createdAt?: string;
};

const ListePlaces = () => {
  const [inputSearch, setInputSearch] = useState<string>("");
  const [listes, setListes] = useState<Liste[]>([]);

  const [chargement, setChargement] = useState(false);

  const [erreur, setErreur] = useState<any>(false);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [nomListe, setNomListe] = useState("");

  const getListes = async () => {
    try {
      setChargement(true);
      const user_id = authentificationService.getUser()?.userId;
      const res = await api.get("/lists", { params: { user_id } });
      setListes(res.data);
      setChargement(false);
    } catch (error) {
      setChargement(false);
      setErreur(error);
    }
  };

  useEffect(() => {
    getListes();
  }, []);
  const handleCreateListe = async () => {
    try {
      const user = authentificationService.getUser();

      if (!user) {
        setErreur("Vous devez être connecté");
        return;
      }

      if (!nomListe.trim()) {
        setErreur("Le nom de la liste est obligatoire");
        return;
      }

      await api.post("/lists", {
        nom: nomListe,
        createur: user.userId,
      });

      setOpen(false);
      setNomListe("");
      setErreur(null);
      getListes();
    } catch (error: any) {
      setErreur(
        error.response?.data?.message ||
          error.message ||
          "Erreur création liste",
      );
    }
  };

  const attributionRole = (liste: Liste) =>
    authentificationService.getRole(liste.membres);

  const filteredListes = listes.filter((liste) =>
    liste.nom.toLowerCase().includes(inputSearch.toLowerCase()),
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f7f4ed 0%, #efe7da 45%, #f8f8f8 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "left",
              mb: 4,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              Découvrir les listes de lieux
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Retrouvez toutes les listes enregistrées.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.25,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Créer une liste
          </Button>
        </Box>

        {erreur && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {erreur}
          </Alert>
        )}

        {chargement ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Recherche par nom"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                  lg: "1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {filteredListes.length > 0 ? (
                filteredListes.map((liste) => (
                  <Card
                    key={liste._id}
                    onClick={() => navigate(`/liste-lieux/${liste._id}`)}
                    sx={{
                      borderRadius: 5,
                      overflow: "hidden",
                      boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 24px 50px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 140,
                        background:
                          "linear-gradient(135deg, #c97b63 0%, #f0b48a 50%, #f7d9b8 100%)",
                        display: "flex",
                        alignItems: "flex-end",
                        p: 2.5,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "rgba(255,255,255,0.88)",
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        Liste de lieux
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={1.5}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {liste.nom}
                        </Typography>

                        <Typography variant="body2">
                          <strong>Créateur :</strong>{" "}
                          {liste.createur || "Non renseigné"}
                        </Typography>

                        <Typography variant="body2">
                          <strong>Nombre de membres :</strong>{" "}
                          {liste.membres?.length || 0}
                        </Typography>

                        <Typography variant="body2">
                          <strong>Créée le :</strong>{" "}
                          {liste.createdAt
                            ? new Date(liste.createdAt).toLocaleDateString()
                            : "Non renseigné"}
                        </Typography>

                        <Typography variant="body2">
                          <strong>Role du membre :</strong>{" "}
                          {attributionRole(liste)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div>
                  <h2>Aucune liste de lieux n'a été trouvée</h2>
                </div>
              )}
            </Box>
          </>
        )}

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Créer une liste</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nom de la liste"
              margin="normal"
              value={nomListe}
              onChange={(e) => setNomListe(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleCreateListe}>
              Créer
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ListePlaces;
