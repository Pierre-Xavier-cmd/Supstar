import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import categorie from "../constantes/categorie.json";
import { useNavigate, useParams } from "react-router-dom";
import { authentificationService } from "../services/authentification";
import CreationPlace from "./CreationPlace";

const Places = () => {
  type Place = {
    _id: string;
    nom: string;
    adresse: string;
    ville: string;
    pays: string;
    categorie?: string;
    description?: string;
    horaires?: string;
    prix?: number;
    tags: string[];
    photos: string[];
    noteGlobale: number;
    statut?: string;
    coordonneesGps?: {
      latitude?: number;
      longitude?: number;
    };
  };

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

  const [places, setPlaces] = useState<Place[]>([]);

  const [listes, setListes] = useState<Liste | undefined>();

  const [chargement, setChargement] = useState(false);

  const [erreur, setErreur] = useState<any>(false);

  const [inputSearch, setInputSearch] = useState<string>("");

  const [categorieSearch, setCategorieSearch] = useState<string>("");

  const [villeSearch, setVilleSearch] = useState<string>("");
  const [noteMin, setNoteMin] = useState<number>(0);
  const [prixMax, setPrixMax] = useState<number>(0);
  const [statutSearch, setStatutSearch] = useState<string>("");

  const navigate = useNavigate();

  const { id } = useParams();

  const [open, setOpen] = useState(false);

  const [openInvitation, setOpenInvitation] = useState(false);

  const [emailInvitation, setEmailInvitation] = useState("");

  const [roleInvitation, setRoleInvitation] = useState("lecteur");

  const [success, setSuccess] = useState("");

  const getPlaces = async () => {
    try {
      setChargement(true);

      const [resPlace, resListe] = await Promise.all([
        api.get("/places", { params: { liste: id } }),
        api.get(`/lists/${id}`),
      ]);

      setPlaces(resPlace.data);
      setListes(resListe.data);
      setChargement(false);
    } catch (error) {
      setChargement(false);
      setErreur(error);
    }
  };

  useEffect(() => {
    getPlaces();
  }, []);

  const handleInvitation = async () => {
    try {
      await api.post(`/lists/${id}/partager`, {
        email: emailInvitation,
        role: roleInvitation,
      });
      setOpenInvitation(false);
      setEmailInvitation("");
      setRoleInvitation("lecteur");
      setSuccess("Invitation envoyée avec succès");
      getPlaces();
    } catch (error: any) {
      setErreur(
        error.response?.data?.message ||
          error.message ||
          "Erreur lors de l'invitation",
      );
    }
  };

  const filteredPlaces = places.filter((place) => {
    const texte = inputSearch.toLowerCase();

    const matchTexte =
      !texte ||
      place.nom.toLowerCase().includes(texte) ||
      place.description?.toLowerCase().includes(texte) ||
      place.ville.toLowerCase().includes(texte) ||
      place.pays.toLowerCase().includes(texte) ||
      place.adresse.toLowerCase().includes(texte);

    const matchCategorie =
      !categorieSearch ||
      place.categorie?.toLowerCase() === categorieSearch.toLowerCase();

    const matchVille =
      !villeSearch ||
      place.ville.toLowerCase().includes(villeSearch.toLowerCase()) ||
      place.pays.toLowerCase().includes(villeSearch.toLowerCase());

    const matchNote = noteMin === 0 || place.noteGlobale >= noteMin;

    const matchPrix = prixMax === 0 || (place.prix ?? 0) <= prixMax;

    const matchStatut =
      !statutSearch ||
      place.statut?.toLowerCase() === statutSearch.toLowerCase();

    return (
      matchTexte &&
      matchCategorie &&
      matchVille &&
      matchNote &&
      matchPrix &&
      matchStatut
    );
  });

  const attributionRole = listes
    ? authentificationService.getRole(listes.membres)
    : undefined;

  const peutAjouterLieu = ["createur", "editeur"].includes(
    attributionRole ?? "",
  );

  const peutInviter = attributionRole === "createur";

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
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between" }}>
          <div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                mb: 4,
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                Découvrir les lieux
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Explorez les lieux enregistrés avec leurs détails essentiels.
              </Typography>
            </Box>
          </div>
          <div>
            <div>
              {peutInviter && (
                <Dialog
                  open={openInvitation}
                  onClose={() => setOpenInvitation(false)}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle>Inviter une personne</DialogTitle>
                  <DialogContent>
                    <TextField
                      type="email"
                      fullWidth
                      label="Email"
                      margin="normal"
                      value={emailInvitation}
                      onChange={(e) => setEmailInvitation(e.target.value)}
                    />
                    <Select
                      fullWidth
                      value={roleInvitation}
                      onChange={(e) => setRoleInvitation(e.target.value)}
                    >
                      <MenuItem value="lecteur">Lecteur</MenuItem>
                      <MenuItem value="commentateur">Commentateur</MenuItem>
                      <MenuItem value="editeur">Editeur</MenuItem>
                    </Select>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenInvitation(false)}>
                      Annuler
                    </Button>
                    <Button variant="contained" onClick={handleInvitation}>
                      Inviter
                    </Button>
                  </DialogActions>
                </Dialog>
              )}

              {peutAjouterLieu && (
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle>Créer un lieu</DialogTitle>
                  <DialogContent>
                    {/* <CreationPlace liste={liste} /> */}
                    <CreationPlace
                      onCreated={() => {
                        setOpen(false);
                        setSuccess("Le lieu a été créé avec succès");
                        getPlaces();
                      }}
                      liste={id ?? ""}
                    />
                  </DialogContent>
                </Dialog>
              )}

              {peutAjouterLieu && (
                <Button onClick={() => setOpen(true)}>
                  Ajouter un lieu à la liste
                </Button>
              )}
              {peutInviter && (
                <Button onClick={() => setOpenInvitation(true)}>Inviter</Button>
              )}
            </div>
          </div>
        </Box>

        {erreur ? (
          <Alert severity="error">{erreur}</Alert>
        ) : chargement ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                  lg: "repeat(6, 1fr)",
                },
                gap: 2,
                mb: 4,
              }}
            >
              <TextField
                fullWidth
                label="Recherche plein texte"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
              />

              <TextField
                fullWidth
                label="Ville ou pays"
                value={villeSearch}
                onChange={(e) => setVilleSearch(e.target.value)}
              />

              <TextField
                fullWidth
                type="number"
                label="Note minimale"
                value={noteMin}
                onChange={(e) => setNoteMin(Number(e.target.value))}
              />

              <TextField
                fullWidth
                type="number"
                label="Prix maximum"
                value={prixMax}
                onChange={(e) => setPrixMax(Number(e.target.value))}
              />

              <TextField
                fullWidth
                label="Statut"
                value={statutSearch}
                onChange={(e) => setStatutSearch(e.target.value)}
                placeholder="favoris, visités..."
              />
              <FormControl fullWidth>
                <InputLabel id="categorie-label" shrink>
                  Catégorie
                </InputLabel>

                <Select
                  displayEmpty
                  labelId="categorie-label"
                  id="categorie-select"
                  value={categorieSearch}
                  label="Catégorie"
                  renderValue={(selected) =>
                    selected
                      ? categorie.find((cat) => cat.value === selected)?.name
                      : "Catégorie"
                  }
                  onChange={(e) => setCategorieSearch(e.target.value)}
                >
                  {categorie.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <Card
                    key={place._id}
                    onClick={() => navigate(`/lieux/${place._id}`)}
                    sx={{
                      height: "100%",
                      borderRadius: 5,
                      overflow: "hidden",
                      boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 24px 50px rgba(0,0,0,0.12)",
                        cursor: "pointer",
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
                        {place.categorie || "Lieu"}
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Box sx={{ mb: 100 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {place.nom}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            textAlign: "left",
                            gap: 1,
                            width: "100%",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {place.description ||
                              "Aucune description disponible."}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                          >
                            <LocationOnOutlinedIcon fontSize="small" />
                            <Typography variant="body2">
                              {place.adresse}, {place.ville}, {place.pays}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                          >
                            <StarBorderRoundedIcon fontSize="small" />
                            <Typography variant="body2">
                              Note : {place.noteGlobale ?? 0}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                          >
                            <SellOutlinedIcon fontSize="small" />
                            <Typography variant="body2">
                              Prix : {place.prix ?? "Non renseigné"}
                            </Typography>
                          </Stack>

                          <Typography variant="body2">
                            <strong>Horaires :</strong>{" "}
                            {place.horaires || "Non renseigné"}
                          </Typography>

                          <Typography variant="body2">
                            <strong>Statut :</strong>{" "}
                            {place.statut || "Non renseigné"}
                          </Typography>

                          <Typography variant="body2">
                            <strong>Coordonnées GPS :</strong>{" "}
                            {place.coordonneesGps
                              ? `${place.coordonneesGps.latitude ?? "-"}, ${place.coordonneesGps.longitude ?? "-"}`
                              : "Non renseigné"}
                          </Typography>

                          <Typography variant="body2">
                            <strong>Photos :</strong>{" "}
                            {place.photos.length > 0
                              ? place.photos.join(", ")
                              : "Aucune photo"}
                          </Typography>

                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                          >
                            {place.tags.length > 0 ? (
                              place.tags.map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  size="small"
                                  sx={{
                                    borderRadius: 999,
                                    bgcolor: "#f3efe8",
                                    fontWeight: 600,
                                  }}
                                />
                              ))
                            ) : (
                              <Chip
                                label="Aucun tag"
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 999 }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div>
                  <h2>Auncun lieu n'a été trouvé</h2>
                </div>
              )}
            </Box>
          </div>
        )}

        <Snackbar
          open={Boolean(success)}
          autoHideDuration={6000}
          onClose={() => setSuccess("")}
          message={success}
        />
      </Container>
    </Box>
  );
};

export default Places;
