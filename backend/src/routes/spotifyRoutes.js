const express = require('express');
const router = express.Router();

const spotifyController = require('../controllers/spotifyController');
const auth = require('../middlewares/authMiddleware');
const permitRoles = require('../middlewares/roleMiddleware');

router.get('/search', spotifyController.search); // sin auth para pruebas
router.get('/track/:id', auth, spotifyController.getTrackById);
router.get('/artist/:id', auth, spotifyController.getArtistById);
router.get('/artist/:id/top-tracks', auth, spotifyController.getArtistTopTracks);
router.get('/artist/:id/albums', auth, spotifyController.getArtistAlbums);
router.get('/album/:id', auth, spotifyController.getAlbumById);
// Solo owner y standard pueden importar playlists de Spotify
router.get('/playlist/:id', auth, permitRoles('owner', 'standard'), spotifyController.getPlaylistById);
router.get('/playlist/:id/tracks', auth, permitRoles('owner', 'standard'), spotifyController.getPlaylistTracks);

module.exports = router;
