const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  spotifyId: String,
  title: String,
  artist: String,
  cover: String,
  // Puedes agregar más campos si quieres
});

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  songs: [SongSchema], // <--- Array de objetos, NO de referencias
  cover: String,
  fromSpotify: Boolean,
  spotifyId: String,
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
