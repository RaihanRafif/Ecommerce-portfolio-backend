// routes/reviewRoutes.js
const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth'); // Middleware to ensure user is authenticated

const router = express.Router();

// Route to create a review
router.post('/', authMiddleware, reviewController.createReview);

// Define additional routes for reviews

// Route to get all reviews for a specific product
router.get('/:productId', reviewController.getReviewsByProduct);

// Route to get all reviews by a specific user
router.get('/user/:userId', authMiddleware, reviewController.getReviewsByUser);

// Route to update a review
router.put('/:reviewId', authMiddleware, reviewController.updateReview);

// Route to delete a review
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router;
