const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    prenom: {
      type: String,
      required: true,
      unique: false,
    },

    nom: {
      type: String,
      required: true,
      unique: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    motDePasse: {
      type: String,
      required: true,
      unique: false,
    },

    preferences: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.motDePasse;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("motDePasse")) return;

  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

userSchema.methods.comparePassword = async function (motDePasse) {
  return await bcrypt.compare(motDePasse, this.motDePasse);
};

module.exports = mongoose.model("User", userSchema);
