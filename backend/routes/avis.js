const express = require("express");
const Avis = require("../models/Avis");
const Place = require("../models/Place");
const verifyToken = require("../middleware/auth");

const router = express.Router();

async function recalculerNoteGlobale(lieuId) {
  const [resultat] = await Avis.aggregate([
    {
      $match: {
        lieu: lieuId,
        note: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$lieu",
        moyenne: { $avg: "$note" },
      },
    },
  ]);

  const noteGlobale = resultat ? Math.round(resultat.moyenne * 10) / 10 : 0;

  await Place.findByIdAndUpdate(lieuId, { noteGlobale });
}

// Récupérer les avis d'un lieu publié
router.get("/:lieuId", async (req, res) => {
  try {
    const lieu = await Place.findById(req.params.lieuId);

    if (!lieu) {
      return res.status(404).json({ message: "Lieu non trouvé" });
    }

    const avis = await Avis.find({ lieu: lieu._id })
      .populate("auteur", "prenom nom")
      .sort({ createdAt: -1 });

    res.json(avis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer ou modifier son avis
router.post("/:lieuId", verifyToken, async (req, res) => {
  try {
    const { commentaire, note } = req.body;

    const lieu = await Place.findById(req.params.lieuId);

    if (!lieu) {
      return res.status(404).json({ message: "Lieu non trouvé" });
    }

    const commentaireNettoye =
      typeof commentaire === "string" ? commentaire.trim() : "";

    const noteNumerique =
      note === "" || note === null || note === undefined ? null : Number(note);

    if (!commentaireNettoye && noteNumerique === null) {
      return res.status(400).json({
        message: "Ajoutez une note ou un commentaire",
      });
    }

    if (
      noteNumerique !== null &&
      (!Number.isFinite(noteNumerique) ||
        noteNumerique < 1 ||
        noteNumerique > 5)
    ) {
      return res.status(400).json({
        message: "La note doit être comprise entre 1 et 5",
      });
    }

    const avis = await Avis.findOneAndUpdate(
      {
        lieu: lieu._id,
        auteur: req.user.userId,
      },
      {
        $set: {
          commentaire: commentaireNettoye,
          note: noteNumerique,
        },
        $setOnInsert: {
          lieu: lieu._id,
          auteur: req.user.userId,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    await recalculerNoteGlobale(lieu._id);

    res.json(avis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer son avis
router.delete("/:lieuId", verifyToken, async (req, res) => {
  try {
    const avis = await Avis.findOneAndDelete({
      lieu: req.params.lieuId,
      auteur: req.user.userId,
    });

    if (!avis) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }

    await recalculerNoteGlobale(avis.lieu);

    res.json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
