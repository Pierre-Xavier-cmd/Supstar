import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { authentificationService } from "../services/authentification";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

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
  liste?: string;
  coordonneesGps?: {
    latitude?: number;
    longitude?: number;
  };
};

type Liste = {
  _id: string;
  membres: {
    user: string;
    role: string;
  }[];
};

type Avis = {
  _id: string;
  commentaire: string;
  note: number | null;
  auteur?: {
    prenom?: string;
    nom?: string;
  };
  createdAt: string;
};

function PlaceDetails() {
  const { id } = useParams();

  const [data, setData] = useState<Place | null>(null);
  const [liste, setListe] = useState<Liste | null>(null);

  const [chargement, setChargement] = useState(false);
  const [chargementListe, setChargementListe] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const [avis, setAvis] = useState<Avis[]>([]);
  const [chargementAvis, setChargementAvis] = useState(false);
  const [erreurAvis, setErreurAvis] = useState<string | null>(null);

  const [commentaire, setCommentaire] = useState("");
  const [note, setNote] = useState<number | null>(null);
  const [envoiAvis, setEnvoiAvis] = useState(false);

  const getPlaceById = async () => {
    if (!id) {
      return;
    }

    try {
      setChargement(true);
      setErreur(null);

      const resPlace = await api.get(`/places/${id}`);
      setData(resPlace.data);

      if (authentificationService.isConnected() && resPlace.data.liste) {
        try {
          setChargementListe(true);

          const resListe = await api.get(`/lists/${resPlace.data.liste}`);

          setListe(resListe.data);
        } catch {
          setListe(null);
        } finally {
          setChargementListe(false);
        }
      }
    } catch (error: unknown) {
      setErreur(getErrorMessage(error, "Erreur lors du chargement du lieu"));
    } finally {
      setChargement(false);
    }
  };

  const getAvis = async () => {
    if (!id) {
      return;
    }

    try {
      setChargementAvis(true);
      setErreurAvis(null);

      const res = await api.get(`/avis/${id}`);
      setAvis(res.data);
    } catch (error: unknown) {
      setErreurAvis(
        getErrorMessage(error, "Erreur lors du chargement des avis"),
      );
    } finally {
      setChargementAvis(false);
    }
  };

  useEffect(() => {
    getPlaceById();
    getAvis();
  }, [id]);

  const attributionRole = liste
    ? authentificationService.getRole(liste.membres)
    : undefined;

  const peutCommenter = ["createur", "editeur", "commentateur"].includes(
    attributionRole ?? "",
  );

  const latitude = data?.coordonneesGps?.latitude;
  const longitude = data?.coordonneesGps?.longitude;
  const carteUrl =
    latitude !== undefined && longitude !== undefined
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`
      : null;

  const handleSubmitAvis = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      return;
    }

    if (!commentaire.trim() && note === null) {
      setErreurAvis("Ajoutez une note ou un commentaire");
      return;
    }

    try {
      setEnvoiAvis(true);
      setErreurAvis(null);

      await api.post(`/avis/${id}`, {
        commentaire,
        note,
      });

      setCommentaire("");
      setNote(null);

      await Promise.all([getPlaceById(), getAvis()]);
    } catch (error: unknown) {
      setErreurAvis(
        getErrorMessage(error, "Erreur lors de l'envoi de votre avis"),
      );
    } finally {
      setEnvoiAvis(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {erreur ? (
        <Alert severity="error">{erreur}</Alert>
      ) : chargement ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : data ? (
        <>
          <Card
            sx={{
              borderRadius: 6,
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
                variant="h3"
                sx={{ fontWeight: 800, color: "#1f1f1f" }}
              >
                {data.nom}
              </Typography>

              <Typography variant="body1" sx={{ mt: 1, color: "#3b312c" }}>
                {data.categorie || "Lieu"} • {data.ville}, {data.pays}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                }}
              >
                <Rating
                  value={data.noteGlobale || 0}
                  precision={0.1}
                  readOnly
                />

                <Typography variant="body2">
                  {data.noteGlobale > 0
                    ? `${data.noteGlobale}/5`
                    : "Aucune note pour le moment"}
                </Typography>
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Description
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {data.description || "Non renseigné"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#faf7f2" }}>
                    <Typography variant="body2" color="text.secondary">
                      Adresse
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {data.adresse}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#faf7f2" }}>
                    <Typography variant="body2" color="text.secondary">
                      Horaires
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {data.horaires || "Non renseigné"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#faf7f2" }}>
                    <Typography variant="body2" color="text.secondary">
                      Prix
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {data.prix ?? "Non renseigné"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#faf7f2" }}>
                    <Typography variant="body2" color="text.secondary">
                      Note globale
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {data.noteGlobale > 0
                        ? `${data.noteGlobale}/5`
                        : "Aucune note"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#faf7f2" }}>
                    <Typography variant="body2" color="text.secondary">
                      Statut
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {data.statut || "Non renseigné"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#faf7f2" }}>
                    <Typography variant="body2" color="text.secondary">
                      Coordonnées GPS
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {data.coordonneesGps
                        ? `${data.coordonneesGps.latitude ?? "-"}, ${
                            data.coordonneesGps.longitude ?? "-"
                          }`
                        : "Non renseigné"}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Tags
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    {data.tags.length > 0 ? (
                      data.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          sx={{
                            borderRadius: 999,
                            bgcolor: "#f3efe8",
                            fontWeight: 600,
                          }}
                        />
                      ))
                    ) : (
                      <Chip label="Aucun tag" variant="outlined" />
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Photos
                  </Typography>

                  {data.photos.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {data.photos.map((photo) => (
                        <Box
                          component="img"
                          key={photo}
                          src={photo}
                          alt={`Photo de ${data.nom}`}
                          sx={{
                            width: 180,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 2,
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      Aucune photo
                    </Typography>
                  )}
                </Box>

                {carteUrl && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Carte
                    </Typography>

                    <Box
                      component="iframe"
                      title={`Carte de ${data.nom}`}
                      src={carteUrl}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: 300,
                        border: 0,
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              Avis des utilisateurs
            </Typography>

            {!authentificationService.isConnected() ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                Connectez-vous pour laisser un avis.
              </Alert>
            ) : chargementListe ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            ) : peutCommenter ? (
              <Card sx={{ borderRadius: 4, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Donner votre avis
                  </Typography>

                  {erreurAvis && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {erreurAvis}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmitAvis}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Note facultative
                    </Typography>

                    <Rating
                      value={note}
                      onChange={(_, nouvelleNote) => setNote(nouvelleNote)}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Commentaire facultatif"
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                      sx={{ mb: 2 }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={envoiAvis}
                    >
                      {envoiAvis ? "Envoi..." : "Publier mon avis"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                Votre rôle ne permet pas de laisser un avis.
              </Alert>
            )}

            {chargementAvis ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : avis.length > 0 ? (
              <Stack spacing={2}>
                {avis.map((unAvis) => (
                  <Card key={unAvis._id} sx={{ borderRadius: 4 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          {unAvis.auteur?.prenom || "Utilisateur"}{" "}
                          {unAvis.auteur?.nom || ""}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {new Date(unAvis.createdAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </Typography>
                      </Box>

                      {unAvis.note !== null && (
                        <Rating value={unAvis.note} readOnly sx={{ mt: 1 }} />
                      )}

                      {unAvis.commentaire && (
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {unAvis.commentaire}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Alert severity="info">Aucun avis pour le moment.</Alert>
            )}
          </Box>
        </>
      ) : null}
    </Container>
  );
}

export default PlaceDetails;
