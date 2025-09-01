const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, profileController.getProfiles);
router.get('/:id', auth, profileController.getProfileById);
router.post('/', auth, profileController.createProfile);
router.put('/:id', auth, profileController.updateProfile);
router.delete('/:id', auth, profileController.deleteProfile);
router.put('/:id/favorite-artist', auth, profileController.setFavoriteArtist);
router.put('/:id/favorite-album', auth, profileController.setFavoriteAlbum);

module.exports = router;
