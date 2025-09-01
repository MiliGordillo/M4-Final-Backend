const spotifyService = require('../services/spotifyService');

exports.getTrackById = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await spotifyService.getTrackById(id);
    res.json(track);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener track', error: err.message });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await spotifyService.getArtistById(id);
    res.json(artist);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener artista', error: err.message });
  }
};

exports.getArtistTopTracks = async (req, res) => {
  try {
    const { id } = req.params;
    const { market } = req.query;
    const topTracks = await spotifyService.getArtistTopTracks(id, market);
    res.json(topTracks);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener top tracks', error: err.message });
  }
};

exports.getArtistAlbums = async (req, res) => {
  try {
    const { id } = req.params;
    const albums = await spotifyService.getArtistAlbums(id);
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener albums', error: err.message });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await spotifyService.getAlbumById(id);
    res.json(album);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener album', error: err.message });
  }
};

exports.getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await spotifyService.getPlaylistById(id);
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener playlist', error: err.message });
  }
};

exports.getPlaylistTracks = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await spotifyService.getPlaylistById(id);
    res.json(playlist.tracks);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tracks de la playlist', error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const params = req.query;
    const recommendations = await spotifyService.getRecommendations(params);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener recomendaciones', error: err.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { q, type = "track" } = req.query;
    const results = await spotifyService.search(q, type);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar', error: err.message });
  }
};
