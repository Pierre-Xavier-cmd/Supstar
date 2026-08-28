require("dotenv").config();
const express = require("express");
const connectDb = require("./config/db");
const app = express();
connectDb();
const usersRouter = require("./routes/users");
const placesRouter = require("./routes/places");
const listsRoutes = require("./routes/lists");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api/users", usersRouter);

app.use("/api/places", placesRouter);

app.use("/api/lists", listsRoutes);

app.listen(process.env.PORT, () => {
  console.log("Serveur ok sur le port 5000");
});
