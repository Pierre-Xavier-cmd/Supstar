const mongoose = require("mongoose");

const roles = ["createur", "editeur", "lecteur", "commentateur"];

const ListSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      unique: false,
    },
    createur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    membres: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          role: { type: String, enum: roles, required: true },
        },
      ],
      default: [],
    },
    lieux: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Place",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("List", ListSchema);
