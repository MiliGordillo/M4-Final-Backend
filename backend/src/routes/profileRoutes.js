// profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middlewares/authMiddleware');

console.log("✅ Cargando rutas de perfil");

// rutas específicas primero
router.put('/:id/favorite-artist', auth, profileController.setFavoriteArtist);
router.put('/:id/favorite-album', auth, profileController.setFavoriteAlbum);

// después las genéricas
router.get('/', auth, profileController.getProfiles);
router.get('/:id', auth, profileController.getProfileById);
router.post('/', auth, profileController.createProfile);
router.put('/:id', auth, profileController.updateProfile);
router.delete('/:id', auth, profileController.deleteProfile);

module.exports = router;

