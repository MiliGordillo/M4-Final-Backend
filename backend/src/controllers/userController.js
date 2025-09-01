const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: err.message });
  }
};

exports.setFavoriteArtist = async (req, res) => {
  const { artistId } = req.body;
  await User.findByIdAndUpdate(req.user.id, { favoriteArtist: artistId });
  res.json({ success: true });
};

exports.setFavoriteAlbum = async (req, res) => {
  const { albumId } = req.body;
  await User.findByIdAndUpdate(req.user.id, { favoriteAlbum: albumId });
  res.json({ success: true });
};

exports.getFavorites = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    favoriteArtist: user.favoriteArtist,
    favoriteAlbum: user.favoriteAlbum
  });
};
