// routes/productPhoto.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const productPhotoController = require('../controllers/productPhotoController');
const authMiddleware = require('../middleware/auth');

const upload = multer({ dest: 'public/photo_products' }); // Configure multer for handling file uploads

router.post('/', authMiddleware, upload.array('photos', 10), productPhotoController.uploadPhotos);

module.exports = router;
