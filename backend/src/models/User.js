const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['owner', 'standard', 'child'], default: 'owner' }],
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  favoriteArtist: { type: String, default: null },
  favoriteAlbum: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);
