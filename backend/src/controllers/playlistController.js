const Playlist = require('../models/Playlist');

// Obtener todas las playlists de un perfil
const Profile = require('../models/Profile');
exports.getPlaylistsByProfile = async (req, res) => {
  try {
    const playlists = await Playlist.find({ profile: req.params.profileId }); // sin .populate('songs')
    // Validar tipo de perfil
    const profile = await Profile.findById(req.params.profileId);
    let filteredPlaylists = playlists;
    if (profile && profile.type === 'child') {
      // Filtrar canciones explícitas de cada playlist
      filteredPlaylists = playlists.map(pl => ({
        ...pl.toObject(),
        songs: (pl.songs || []).filter(song => !song.explicit)
      }));
    }
    res.json(filteredPlaylists);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener playlists', error: err.message });
  }
};

// Crear una nueva playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { name, songs, cover, fromSpotify, spotifyId } = req.body;
    const profileId = req.params.profileId;

    const playlist = new Playlist({
      name,
      songs, // <--- Aquí debe guardar el array de canciones
      cover,
      fromSpotify,
      spotifyId,
      profile: profileId,
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: "No se pudo crear la playlist" });
  }
};

// Editar una playlist (agregar/quitar canciones embebidas)
exports.updatePlaylist = async (req, res) => {
  try {
    const { name, songs } = req.body;
    // songs debe ser un array de objetos {spotifyId, title, artist, cover}
    const playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { name, songs },
      { new: true }
    );
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar playlist', error: err.message });
  }
};

// Eliminar una playlist
exports.deletePlaylist = async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Playlist eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar playlist', error: err.message });
  }
};

exports.searchPlaylists = async (req, res) => {
  try {
    const search = req.query.search || "";
    // Solo playlists originales (no copias)
    const playlists = await Playlist.find({
      name: { $regex: search, $options: "i" },
      originalPlaylist: null // <-- Solo originales
    }).populate('profile', 'name');
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar playlists', error: err.message });
  }
};

// Eliminar una canción de una playlist
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    // Elimina la canción por _id o spotifyId
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }
    playlist.songs = playlist.songs.filter(
      (song) =>
        song.toString() !== songId && // Para referencias por ObjectId
        song._id?.toString() !== songId && // Para canciones embebidas con _id
        song.spotifyId !== songId // Para canciones embebidas con spotifyId
    );
    await playlist.save();
    res.json({ message: 'Canción eliminada de la playlist' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar canción', error: err.message });
  }
};
