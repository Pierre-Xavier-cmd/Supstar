import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
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
  coordonneesGps?: {
    latitude?: number;
    longitude?: number;
  };
};

function PlaceDetails() {
  const { id } = useParams();
  const [data, setData] = useState<Place | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const getPlaceById = async () => {
      try {
        setChargement(true);
        setErreur(null);

        const res = await api.get(`/places/${id}`);
        setData(res.data);
      } catch (error: any) {
        setErreur(
          error.response?.data?.message ||
            error.message ||
            "Erreur lors du chargement de la place",
        );
      } finally {
        setChargement(false);
      }
    };

    if (id) {
      getPlaceById();
    }
  }, [id]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {erreur ? (
        <Alert severity="error">{erreur}</Alert>
      ) : chargement ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : data ? (
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
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#1f1f1f" }}>
              {data.nom}
            </Typography>

            <Typography variant="body1" sx={{ mt: 1, color: "#3b312c" }}>
              {data.categorie || "Lieu"} • {data.ville}, {data.pays}
            </Typography>
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
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#faf7f2",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Adresse
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {data.adresse}
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
                    Horaires
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {data.horaires || "Non renseigné"}
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
                    Prix
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {data.prix ?? "Non renseigné"}
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
                    Note globale
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {data.noteGlobale}
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
                    Statut
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {data.statut || "Non renseigné"}
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
                    Coordonnées GPS
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {data.coordonneesGps
                      ? `${data.coordonneesGps.latitude ?? "-"}, ${data.coordonneesGps.longitude ?? "-"}`
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
                    data.tags.map((tag: string, index: number) => (
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
                <Typography variant="body1" color="text.secondary">
                  {data.photos.length > 0 ? data.photos.join(", ") : "Aucune"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Container>
  );
}

export default PlaceDetails;
