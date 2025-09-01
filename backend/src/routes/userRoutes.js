const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.delete('/:id', auth, userController.deleteUser);
router.put('/favorite-artist', auth, userController.setFavoriteArtist);
router.put('/favorite-album', auth, userController.setFavoriteAlbum);
router.get('/favorites', auth, userController.getFavorites);

module.exports = router;
