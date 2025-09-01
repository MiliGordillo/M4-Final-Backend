const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['adult', 'child'], default: 'adult' },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  avatar: { type: String },
  language: { type: String, default: 'es' },
  ageRestriction: { type: Number, default: 18 }, // 18 = sin restricción, 13 = adolescente, 7 = infantil
  myList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  activity: [{
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    playedAt: { type: Date, default: Date.now }
  }],
  favoriteArtist: { type: String, default: null },
  favoriteAlbum: { type: String, default: null },
  favoriteArtists: {
    type: [Object], // array de objetos artista
    default: []
  },
  favoriteAlbums: {
    type: [Object], // array de objetos álbum
    default: []
  },
});

module.exports = mongoose.model('Profile', profileSchema);
