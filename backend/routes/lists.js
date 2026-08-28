const express = require("express");
const list = require("../models/Place");
const User = require("../models/User");
const router = express.Router();

// get toutes les listes
router.get("/", async (req, res) => {
  try {
    const lists = await List.find();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get une par id
router.get("/:id", async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "lieu non trouvé" });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// créer une liste
router.post("/", async (req, res) => {
  try {
    const { nom, createur } = req.body;
    const newList = new List({
      nom,
      createur,
      membres: [{ user: createur, role: "createur" }],
    });
    console.log(newList);
    const listSave = await newList.save();

    res.json(listSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// supprimer une liste par un id
router.delete("/:id", async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "liste non trouvée" });
    }
    res.json({ message: "liste supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// modifier une liste par un id
router.put("/:id", async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(
      req.params.id,
      { nom: req.body.nom },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!list) {
      return res.status(404).json({ message: "liste non trouvé" });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ajouter un membre
// partager
router.post("/:id/partager", async (req, res) => {
  try {
    const { email, role } = req.body;
    const list = await list.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "liste non trouvé" });
    }
    const user = await User.findOne([email]);
    if (!user) {
      return res.status(404).json({ message: "utilisateur non trouvé" });
    }
    const dejaMembre = await list.membres.some(
      (v) => v.user.toString() === user._id.toString(),
    );
    if (dejaMembre) {
      return res
        .status(409)
        .json({ message: "utilisateur déjà dans la liste" });
    }
    list.membres.push({ user: user._id, role: role || "lecteur" });

    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
