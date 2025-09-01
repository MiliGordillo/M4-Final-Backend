const Profile = require('../models/Profile');

exports.getAllProfiles = async (req, res) => {
  try {
    // Obtener el usuario autenticado
    const User = require('../models/User');
    const userId = req.user.id || req.user._id || req.user.userId;
    const user = await User.findById(userId).populate('profiles');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user.profiles);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfiles', error: err.message });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message });
  }
};

const User = require('../models/User');
exports.createProfile = async (req, res) => {
  try {
    const { name, type, avatar, language, ageRestriction, myList } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Faltan campos requeridos (name, type)' });
    }
    const userId = req.user.id || req.user._id || req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: 'No se encontró el id de usuario en el token.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado para asociar el perfil.' });
    }
    // Validar máximo 5 perfiles por usuario
    if (user.profiles && user.profiles.length >= 5) {
      return res.status(400).json({ message: 'Solo puedes tener hasta 5 perfiles por cuenta.' });
    }
    // Crear perfil asociado al usuario autenticado
    const profile = new Profile({
      userId,
      name,
      type,
      avatar,
      language,
      ageRestriction,
      myList
    });
    await profile.save();
    // Agregar el perfil al usuario
    await User.findByIdAndUpdate(userId, { $push: { profiles: profile._id } });
    res.status(201).json(profile);
  } catch (err) {
    console.error('Error en createProfile:', err);
    res.status(500).json({ message: 'Error al crear perfil', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'type', 'avatar', 'language', 'ageRestriction', 'myList'];
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    const profile = await Profile.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!profile) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: err.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json({ message: 'Perfil eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar perfil', error: err.message });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    // Obtener el usuario autenticado
    const User = require('../models/User');
    const userId = req.user.id || req.user._id || req.user.userId;
    const user = await User.findById(userId).populate('profiles');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user.profiles);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfiles', error: err.message });
  }
};

// Agregar álbum favorito
exports.setFavoriteAlbum = async (req, res) => {
  const { id } = req.params;
  const { album } = req.body;
  try {
    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ message: "Perfil no encontrado" });

    // Si no existe el array, inicialízalo
    if (!Array.isArray(profile.favoriteAlbums)) profile.favoriteAlbums = [];

    // Evitar duplicados
    if (!profile.favoriteAlbums.some(a => a.id === album.id)) {
      profile.favoriteAlbums.push(album);
      await profile.save();
    }
    res.json(profile.favoriteAlbums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Agregar artista favorito
exports.setFavoriteArtist = async (req, res) => {
  const { id } = req.params;
  const { artist } = req.body;
  try {
    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ message: "Perfil no encontrado" });

    if (!Array.isArray(profile.favoriteArtists)) profile.favoriteArtists = [];

    if (!profile.favoriteArtists.some(a => a.id === artist.id)) {
      profile.favoriteArtists.push(artist);
      await profile.save();
    }
    res.json(profile.favoriteArtists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
