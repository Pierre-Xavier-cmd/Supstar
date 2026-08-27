const express = require("express");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");

// get tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get un utilisateur par id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// inscription d'un utilisateur
router.post("/inscription", async (req, res) => {
  try {
    const nouveauUser = new User(req.body);
    const userSauvegarde = await nouveauUser.save();

    const token = jwt.sign(
      {
        userId: userSauvegarde._id,
        email: userSauvegarde.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "inscription réussie",
      token,
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      return res.status(500).json({ message: "Utilisateur existe déjà" });
    }
    res.status(500).json({ message: error.message });
  }
});

// connexion d'un utilisateur
router.post("/connexion", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "email ou mot de passe invalide" });
    }

    const isMatch = await user.comparePassword(req.body.motDePasse);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "email ou mot de passe invalide" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        preferences: user.preferences,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "connexion réussie",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// supprimer un user par un id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "utilisateur non trouvé" });
    }
    res.json({ message: "utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// modifier un user par un id
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
