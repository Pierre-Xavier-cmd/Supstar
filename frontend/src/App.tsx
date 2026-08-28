import { BrowserRouter, Routes, Route } from "react-router-dom";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import CreationPlace from "./pages/CreationPlace";
import Places from "./pages/Places";
import Profil from "./pages/Profil";
import Header from "./composants/Header";
import PlaceDetails from "./pages/PlaceDetails";
import Deconnexion from "./pages/Deconnexion";
import PublicRoute from "./composants/PublicRoute";
import ProtectedRoute from "./composants/ProtectedRoute";
import { useEffect, useState } from "react";
import { authentificationService } from "./services/authentification";
import ListePlaces from "./pages/ListePlaces";

function App() {
  // const navigate = useNavigate();

  // const deconnexion = () => {
  //   authentificationService.logout();
  //   navigate("/places");
  // };

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(authentificationService.isConnected());
  }, []);

  return (
    <BrowserRouter>
      <Header isConnected={isConnected} />
      <Routes>
        <Route
          path="/connexion"
          element={
            <PublicRoute>
              <Connexion setIsConnected={setIsConnected} />{" "}
            </PublicRoute>
          }
        />
        <Route path="/liste-lieux" element={<ListePlaces />} />
        <Route path="/liste-lieux/:id" element={<ListePlaces />} />
        <Route path="/lieux" element={<Places />} />
        <Route path="/lieux/:id" element={<PlaceDetails />} />
        <Route
          path="/mon-profil"
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inscription"
          element={
            <PublicRoute>
              <Inscription />
            </PublicRoute>
          }
        />
        <Route
          path="/creation-place"
          element={
            <ProtectedRoute>
              <CreationPlace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deconnexion"
          element={
            <ProtectedRoute>
              <Deconnexion setIsConnected={setIsConnected} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
