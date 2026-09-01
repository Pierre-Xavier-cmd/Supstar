import { useState } from "react";
import api from "../services/api";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, type Params } from "react-router-dom";
import categorie from "../constantes/categorie.json";
type CreationPlaceProps = {
  liste?: string;
  onCreated?: () => void;
};

function CreationPlace({ liste, onCreated }: CreationPlaceProps) {
  const [form, setForm] = useState<any>({
    nom: "",
    adresse: "",
    ville: "",
    pays: "",
    tags: [],
    categorie: "",
    description: "",
    horaires: "",
    prix: 0,
    statut: "",
    photos: [],
    noteGlobale: 0,
    coordonneesGps: {
      latitude: 0,
      longitude: 0,
    },
  });

  //  const [erreur, setErreur] = useState(null);

  const [erreur, setErreur] = useState<string | null>(null);

  const [chargement, setChargement] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setChargement(true);
      //const res = await api.post("/places", { ...form, liste });
      const res = await api.post("/places", {
        ...form,
        ...(liste ? { liste } : {}),
      });
      // const res = await api.post("/lieux", { ...form, liste });

      if (res.data.nom) {
        navigate(`/liste-lieux/${liste}`);
      }
      setChargement(false);
      onCreated?.();

      //      alert("Place créée");
      //      console.log(res.data);
    } catch (error: any) {
      setChargement(false);
      setErreur(error.response?.data?.message);
      //      alert(error.response?.data?.message || "Erreur création place");
    }
  };

  return (
    <Container maxWidth="sm" style={{ padding: 0 }}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Ajoutez un nouveau lieu à votre application.
          </Typography>

          {erreur && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erreur}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom"
              margin="normal"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />

            <TextField
              fullWidth
              label="Adresse"
              margin="normal"
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
            />

            <TextField
              fullWidth
              label="Ville"
              margin="normal"
              value={form.ville}
              onChange={(e) => setForm({ ...form, ville: e.target.value })}
            />

            <TextField
              fullWidth
              label="Pays"
              margin="normal"
              value={form.pays}
              onChange={(e) => setForm({ ...form, pays: e.target.value })}
            />

            <InputLabel id="demo-multiple-name-label">Tags</InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={form.tags}
              label="tags"
              multiple
              input={<OutlinedInput label="Tags" />}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags:
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value,
                })
              }
            >
              <MenuItem value="voyage">Voyage</MenuItem>
              <MenuItem value="ete">Ete</MenuItem>
              <MenuItem value="hiver">Hiver</MenuItem>
            </Select>

            <InputLabel id="demo-multiple-name-label">Categorie</InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={form.categorie}
              label="categorie"
              input={<OutlinedInput label="Categorie" />}
              onChange={(e) => setForm({ ...form, categorie: e.target.value })}
            >
              {categorie.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>

            <TextareaAutosize
              maxRows={4}
              aria-label="description"
              placeholder="Description"
              style={{ width: "100%", height: "100px", marginTop: "24px" }}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input type="file" />

            <TextField
              fullWidth
              label="Photos"
              margin="normal"
              placeholder="https://site.com/photo1.jpg, https://site.com/photo2.jpg"
              value={form.photos.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  photos: e.target.value
                    .split(",")
                    .map((photo) => photo.trim()),
                })
              }
            />

            <TextField
              fullWidth
              type="number"
              label="prix"
              margin="normal"
              value={form.prix}
              onChange={(e) => {
                console.log(typeof e.target.value);
                setForm({
                  ...form,
                  prix: Number(e.target.value) < 0 ? 0 : Number(e.target.value),
                });
              }}
            />

            <TextField
              fullWidth
              label="Horaires"
              margin="normal"
              value={form.horaires}
              onChange={(e) => setForm({ ...form, horaires: e.target.value })}
            />

            <TextField
              fullWidth
              label="Note globale"
              type="number"
              margin="normal"
              value={form.noteGlobale}
              onChange={(e) =>
                setForm({ ...form, noteGlobale: Number(e.target.value) })
              }
            />

            <InputLabel id="demo-multiple-name-label">Statut</InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={form.statut}
              label="statut"
              input={<OutlinedInput label="Statut" />}
              onChange={(e) => setForm({ ...form, statut: e.target.value })}
            >
              <MenuItem value="a_visiter">A visiter</MenuItem>
              <MenuItem value="visite">Visité</MenuItem>
              <MenuItem value="favoris">Favoris</MenuItem>
            </Select>

            <TextField
              fullWidth
              label="Latitude"
              type="number"
              margin="normal"
              value={form.coordonneesGps.latitude}
              onChange={(e) =>
                setForm({
                  ...form,
                  coordonneesGps: {
                    ...form.coordonneesGps,
                    latitude: Number(e.target.value),
                  },
                })
              }
            />

            <TextField
              fullWidth
              label="Longitude"
              type="number"
              margin="normal"
              value={form.coordonneesGps.longitude}
              onChange={(e) =>
                setForm({
                  ...form,
                  coordonneesGps: {
                    ...form.coordonneesGps,
                    longitude: Number(e.target.value),
                  },
                })
              }
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
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Créer"
              )}
            </Button>
          </Box>
        </div>
      </Box>
    </Container>
  );
}

export default CreationPlace;
