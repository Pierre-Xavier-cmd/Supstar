import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {erreur ? (
        <Alert severity="error">{erreur}</Alert>
      ) : chargement ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : data ? (
        <Card sx={{ borderRadius: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              {data.nom}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Adresse :</strong> {data.adresse}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Ville :</strong> {data.ville}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Pays :</strong> {data.pays}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Catégorie :</strong> {data.categorie || "Non renseigné"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Description :</strong>{" "}
              {data.description || "Non renseigné"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Horaires :</strong> {data.horaires || "Non renseigné"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Prix :</strong> {data.prix ?? "Non renseigné"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Tags :</strong>{" "}
              {data.tags.length > 0 ? data.tags.join(", ") : "Aucun"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Photos :</strong>{" "}
              {data.photos.length > 0 ? data.photos.join(", ") : "Aucune"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Note globale :</strong> {data.noteGlobale}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Statut :</strong> {data.statut || "Non renseigné"}
            </Typography>
            <Typography variant="body1">
              <strong>Coordonnées GPS :</strong>{" "}
              {data.coordonneesGps
                ? `${data.coordonneesGps.latitude ?? "-"}, ${data.coordonneesGps.longitude ?? "-"}`
                : "Non renseigné"}
            </Typography>
          </CardContent>
        </Card>
      ) : null}
    </Container>
  );
}

export default PlaceDetails;
