const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      unique: false,
    },

    adresse: {
      type: String,
      required: true,
      unique: false,
    },

    ville: {
      type: String,
      required: true,
      unique: false,
    },

    pays: {
      type: String,
      required: true,
      unique: false,
    },

    categorie: {
      type: String,
    },

    description: {
      type: String,
    },

    horaires: {
      type: String,
    },

    prix: {
      type: Number,
    },

    tags: {
      type: [String],
      default: [],
    },

    photos: {
      type: [String],
      default: [],
      required: true,
    },

    noteGlobale: {
      type: Number,
      default: 0,
    },

    statut: {
      type: String,
    },

    coordonneesGps: {
      latitude: Number,
      longitude: Number,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Place", PlaceSchema);
