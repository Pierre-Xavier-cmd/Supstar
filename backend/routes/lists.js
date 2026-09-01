const express = require("express");
const List = require("../models/List");
const User = require("../models/User");
const router = express.Router();
const verifyToken = require("../middleware/auth");

/* // get toutes les listes
router.get("/", verifyToken, async (req, res) => {
  try {
    const lists = await List.find();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); */

// get toutes les listes accessibles à l'utilisateur connecté
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const lists = await List.find({
      $or: [{ createur: userId }, { "membres.user": userId }],
    });

    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* // get une par id
router.get("/:id", verifyToken, async (req, res) => {
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
 */

// get une liste par id si l'utilisateur y a accès
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const list = await List.findOne({
      _id: req.params.id,
      $or: [{ createur: userId }, { "membres.user": userId }],
    });

    if (!list) {
      return res
        .status(404)
        .json({ message: "liste non trouvée ou accès refusé" });
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* // créer une liste
router.post("/", verifyToken, async (req, res) => {
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
}); */

// créer une liste
router.post("/", verifyToken, async (req, res) => {
  try {
    const { nom } = req.body;
    const createur = req.user.userId;

    const newList = new List({
      nom,
      createur,
      membres: [{ user: createur, role: "createur" }],
    });

    const listSave = await newList.save();
    res.json(listSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* // créer un lieu
router.post("/:id/lieu", verifyToken, async (req, res) => {
  try {
    const { lieu } = req.body;
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "lieu non trouvé" });
    }

    const dejaListe = await list.lieux.some((v) => v.toString() === lieu);
    if (dejaListe) {
      return res.status(409).json({ message: "déjà dans la liste" });
    }
    list.lieux.push(lieu);

    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); */

// créer un lieu
router.post("/:id/lieu", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { lieu } = req.body;

    const list = await List.findOne({
      _id: req.params.id,
      $or: [{ createur: userId }, { "membres.user": userId }],
    });

    if (!list) {
      return res
        .status(404)
        .json({ message: "liste non trouvée ou accès refusé" });
    }

    const membre = list.membres.find((m) => m.user.toString() === userId);
    const canEdit =
      list.createur.toString() === userId ||
      ["createur", "editeur"].includes(membre?.role);

    if (!canEdit) {
      return res.status(403).json({ message: "action non autorisée" });
    }

    const dejaListe = list.lieux.some((v) => v.toString() === lieu);

    if (dejaListe) {
      return res.status(409).json({ message: "déjà dans la liste" });
    }

    list.lieux.push(lieu);
    await list.save();

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* // supprimer une liste par un id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "liste non trouvée" });
    }
    res.json({ message: "liste supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); */

// supprimer une liste
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const list = await List.findOne({
      _id: req.params.id,
      createur: userId,
    });

    if (!list) {
      return res
        .status(404)
        .json({ message: "liste non trouvée ou accès refusé" });
    }

    await List.findByIdAndDelete(req.params.id);

    res.json({ message: "liste supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* // modifier une liste par un id
router.put("/:id", verifyToken, async (req, res) => {
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
}); */

// modifier une liste
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const list = await List.findOne({
      _id: req.params.id,
      $or: [{ createur: userId }, { "membres.user": userId }],
    });

    if (!list) {
      return res
        .status(404)
        .json({ message: "liste non trouvée ou accès refusé" });
    }

    const membre = list.membres.find((m) => m.user.toString() === userId);
    const canEdit =
      list.createur.toString() === userId ||
      ["createur", "editeur"].includes(membre?.role);

    if (!canEdit) {
      return res.status(403).json({ message: "action non autorisée" });
    }

    list.nom = req.body.nom ?? list.nom;
    await list.save();

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* // ajouter un membre
// partager
router.post("/:id/partager", verifyToken, async (req, res) => {
  try {
    const { email, role } = req.body;
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "liste non trouvé" });
    }
    const user = await User.findOne({ email });
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
}); */

// partager une liste / ajouter un membre
/* router.post("/:id/partager", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email, role } = req.body;

    const list = await List.findOne({
      _id: req.params.id,
      $or: [{ createur: userId }, { "membres.user": userId }],
    });

    if (!list) {
      return res
        .status(404)
        .json({ message: "liste non trouvée ou accès refusé" });
    }

    const membre = list.membres.find((m) => m.user.toString() === userId);
    const canShare =
      list.createur.toString() === userId ||
      ["createur", "editeur"].includes(membre?.role);

    if (!canShare) {
      return res.status(403).json({ message: "action non autorisée" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "utilisateur non trouvé" });
    }

    const dejaMembre = list.membres.some(
      (v) => v.user.toString() === user._id.toString(),
    );

    if (dejaMembre) {
      return res
        .status(409)
        .json({ message: "utilisateur déjà dans la liste" });
    }

    list.membres.push({
      user: user._id,
      role: role || "lecteur",
    });

    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); */

// partager une liste / ajouter un membre
router.post("/:id/partager", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email, role } = req.body;

    const list = await List.findOne({
      _id: req.params.id,
      createur: userId,
    });

    if (!list) {
      return res.status(403).json({
        message: "Seul le créateur peut inviter des utilisateurs",
      });
    }

    const roleFinal = role || "lecteur";

    const rolesAutorises = ["lecteur", "commentateur", "editeur"];

    if (!rolesAutorises.includes(roleFinal)) {
      return res.status(400).json({
        message: "Rôle invalide",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
      });
    }

    const dejaMembre = list.membres.some(
      (membre) => membre.user.toString() === user._id.toString(),
    );

    if (dejaMembre) {
      return res.status(409).json({
        message: "Utilisateur déjà dans la liste",
      });
    }

    list.membres.push({
      user: user._id,
      role: roleFinal,
    });

    await list.save();

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
