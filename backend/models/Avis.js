const mongoose = require("mongoose");

const AvisSchema = new mongoose.Schema(
  {
    lieu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentaire: {
      type: String,
      trim: true,
      default: "",
    },
    note: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Un utilisateur ne possède qu'un seul avis par lieu.
AvisSchema.index({ lieu: 1, auteur: 1 }, { unique: true });

module.exports = mongoose.model("Avis", AvisSchema);
