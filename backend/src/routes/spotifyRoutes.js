const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');
const auth = require('../middlewares/authMiddleware');

router.get('/search', spotifyController.search); // sin auth para pruebas
router.get('/track/:id', auth, spotifyController.getTrackById);
router.get('/artist/:id', auth, spotifyController.getArtistById);
router.get('/artist/:id/top-tracks', auth, spotifyController.getArtistTopTracks);
router.get('/artist/:id/albums', auth, spotifyController.getArtistAlbums);
router.get('/album/:id', auth, spotifyController.getAlbumById);
router.get('/playlist/:id', auth, spotifyController.getPlaylistById);
router.get('/playlist/:id/tracks', auth, spotifyController.getPlaylistTracks);
router.get('/recommendations', auth, spotifyController.getRecommendations);

module.exports = router;
