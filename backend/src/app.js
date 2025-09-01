const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/authRoutes"));
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
app.use("/api/profiles", require("./routes/profileRoutes"));
app.use("/api/spotify", require("./routes/spotifyRoutes"));
app.use("/api/playlists", require("./routes/playlistRoutes"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conexión exitosa a MongoDB");
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en puerto ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

module.exports = app;
