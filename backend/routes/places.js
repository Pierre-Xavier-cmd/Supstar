const express = require("express");
const Place = require("../models/Place");
const List = require("../models/List");
const router = express.Router();
const verifyToken = require("../middleware/auth");

async function peutModifierListe(listeId, userId) {
  const list = await List.findOne({
    _id: listeId,
    $or: [{ createur: userId }, { "membres.user": userId }],
  });

  if (!list) return false;

  const membre = list.membres.find((m) => m.user.toString() === userId);
  return (
    list.createur.toString() === userId ||
    ["createur", "editeur"].includes(membre?.role)
  );
}

// get tous les lieux
router.get("/", async (req, res) => {
  try {
    const lieux = { liste: req.query.liste };
    const places = await Place.find(lieux);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get un lieu par id
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "lieu non trouvé" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// créer un lieu
router.post("/", verifyToken, async (req, res) => {
  try {
    const canEdit = await peutModifierListe(
      req.body.liste,
      req.user.userId,
    );

    if (!canEdit) {
      return res.status(403).json({ message: "action non autorisée" });
    }

    const nouveauPlace = new Place(req.body);
    const placeSauvegarde = await nouveauPlace.save();

    res.json(placeSauvegarde);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// supprimer un lieu par un id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "lieu non trouvé" });
    }

    const canEdit = await peutModifierListe(place.liste, req.user.userId);

    if (!canEdit) {
      return res.status(403).json({ message: "action non autorisée" });
    }

    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "lieu supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// modifier un lieu par un id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "lieu non trouvé" });
    }

    const canEdit = await peutModifierListe(place.liste, req.user.userId);

    if (!canEdit) {
      return res.status(403).json({ message: "action non autorisée" });
    }

    const modifications = { ...req.body };
    delete modifications.liste;

    const placeModifie = await Place.findByIdAndUpdate(
      req.params.id,
      modifications,
      {
        new: true,
        runValidators: true,
      },
    );

    res.json(placeModifie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
