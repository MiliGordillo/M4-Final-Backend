const mongoose = require("mongoose");

// Subesquema para artistas favoritos
const favoriteArtistSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // id de Spotify
    name: { type: String, required: true },
    images: [{ url: String }], // solo guardamos lo necesario
  },
  { _id: false } // evita que mongoose genere un _id por cada artista
);

// Subesquema para álbumes favoritos
const favoriteAlbumSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // id de Spotify
    name: { type: String, required: true },
    images: [{ url: String }],
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["adult", "child"], default: "adult" },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
  avatar: { type: String },
  language: { type: String, default: "es" },
  ageRestriction: { type: Number, default: 18 },
  myList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  activity: [
    {
      song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      playedAt: { type: Date, default: Date.now },
    },
  ],

  // 🚀 eliminé los campos singulares (favoriteArtist y favoriteAlbum)
  favoriteArtists: { type: [favoriteArtistSchema], default: [] },
  favoriteAlbums: { type: [favoriteAlbumSchema], default: [] },
});

module.exports = mongoose.model("Profile", profileSchema);

