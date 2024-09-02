const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/auth'); // Assuming you have an authentication middleware

// Route to create a new category (Admin only)
router.post('/', authMiddleware, wishlistController.createWishlist);

router.post('/addProductToWishlist', authMiddleware, wishlistController.appProductToWishlist);

// // Route to get all categories (Accessible to all users)
router.get('/', authMiddleware, wishlistController.getWishlists);

// Route to update a category by ID (Admin only)
router.patch('/:id', authMiddleware, wishlistController.updateWishlist);

// Route to delete a category by ID (Admin only)
router.delete('/:id', authMiddleware, wishlistController.deleteWishlist);

// Route to delete a category by ID (Admin only)
router.delete('/:wishlistId/:productId', authMiddleware, wishlistController.removeWishlistItem);

module.exports = router;
