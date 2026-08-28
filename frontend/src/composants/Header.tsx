import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

type HeaderProps = {
  isConnected: boolean;
};

function Header({ isConnected }: HeaderProps) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            My Places
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button color="inherit" component={RouterLink} to="/places">
              Places
            </Button>

            {isConnected ? (
              <>
                <Button color="inherit" component={RouterLink} to="/mon-profil">
                  Profil
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/creation-place"
                >
                  Créer une place
                </Button>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/deconnexion"
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.5)",
                    "&:hover": {
                      borderColor: "#fff",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/connexion">
                  Connexion
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/inscription"
                  sx={{
                    backgroundColor: "#fff",
                    color: "#1e3a8a",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#e5e7eb",
                    },
                  }}
                >
                  Inscription
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
//        <Link to="/connexion">Connexion</Link> |{" "}
//        <Link to="/places">Places</Link> | <Link to="/mon-profil">Profil</Link>{" "}
//        | <Link to="/inscription">Inscription</Link> |{" "}
//        <Link to="/creation-place">Créer une place</Link> |{" "}
//        <Link to="/deconnexion">Deconnexion</Link>

export default Header;
