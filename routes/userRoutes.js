const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes protected by the authentication middleware
router.patch('/update', authMiddleware, userController.updateUser);
router.patch('/update-password', authMiddleware, userController.updatePassword);

// Profile photo CRUD routes with Multer middleware
router.post('/profile-photo', authMiddleware, upload.single('photo'), userController.createProfilePhoto);
router.get('/profile-photo', authMiddleware, userController.getProfilePhoto);
router.patch('/profile-photo', authMiddleware, upload.single('photo'), userController.updateProfilePhoto);
router.delete('/profile-photo', authMiddleware, userController.deleteProfilePhoto);

module.exports = router;
