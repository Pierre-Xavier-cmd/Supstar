const express = require("express");
const Place = require("../models/Place");
const List = require("../models/List");
const router = express.Router();

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
router.post("/", async (req, res) => {
  try {
    const nouveauPlace = new Place(req.body);
    console.log(nouveauPlace);
    const placeSauvegarde = await nouveauPlace.save();

    res.json(placeSauvegarde);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// supprimer un lieu par un id
router.delete("/:id", async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "lieu non trouvé" });
    }
    res.json({ message: "lieu supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// modifier un lieu par un id
router.put("/:id", async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!place) {
      return res.status(404).json({ message: "lieu non trouvé" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
