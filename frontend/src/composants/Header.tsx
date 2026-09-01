import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
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
            Supstar
          </Typography>
          <div>
            {isConnected && (
              <Button component={RouterLink} to="/liste-lieux" color="inherit">
                Mes listes
              </Button>
            )}

            {isConnected ? (
              <>
                <Button color="inherit" component={RouterLink} to="/mon-profil">
                  Profil
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
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
