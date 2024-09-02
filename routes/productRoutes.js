// routes/product.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth'); // Middleware to authenticate the user
const uploadProductPhotos = require('../middleware/uploadProductMiddleware');


// Product routes
router.post('/', authMiddleware,uploadProductPhotos.array('photos', 10), productController.createProduct);
router.get('/:id?', productController.getProduct);
router.put('/:id', authMiddleware, uploadProductPhotos.array('photos', 10), productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
