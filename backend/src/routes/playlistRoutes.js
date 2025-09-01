const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const auth = require('../middlewares/authMiddleware');

// Todas las playlists de un perfil
router.get('/:profileId', auth, playlistController.getPlaylistsByProfile);
// Crear playlist para un perfil
router.post('/:profileId', auth, playlistController.createPlaylist);
// Editar playlist
router.put('/edit/:id', auth, playlistController.updatePlaylist);
// Eliminar playlist
router.delete('/delete/:id', auth, playlistController.deletePlaylist);
// Nueva ruta global para buscar playlists
router.get('/', playlistController.searchPlaylists);
// Ruta para eliminar una canción de una playlist
router.delete(
  '/:playlistId/song/:songId',
  auth,
  playlistController.removeSongFromPlaylist
);

module.exports = router;
