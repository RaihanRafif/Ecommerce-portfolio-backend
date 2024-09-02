// controllers/reviewController.js
const { Review, Order, OrderItem } = require('../models'); // Import necessary models
const { sequelize } = require('../models');

exports.createReview = async (req, res) => {
    const { productId, rating, comment } = req.body; // Extract productId, rating, and comment from the request body
    const userId = req.user.id; // Assuming user authentication is handled, and user ID is available in the request

    try {
        // Step 1: Check if the user has purchased the product
        const hasPurchased = await Order.findOne({
            where: { userId }, // Check orders of the current user
            include: {
                model: OrderItem,
                as: 'items',
                where: { productSpecificId: productId }, // Check if the product is in any of the orders
            },
        });

        if (!hasPurchased) {
            return res.status(403).json({ message: 'You can only review products you have purchased.' });
        }

        // Step 2: Check if the user has already reviewed this product
        const existingReview = await Review.findOne({
            where: { userId, productId },
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        // Step 3: Create the review
        const review = await Review.create({
            productId,
            userId,
            rating,
            comment,
        });

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const reviews = await Review.findAll({ where: { productId } });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews for product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all reviews by a specific user
exports.getReviewsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const reviews = await Review.findAll({ where: { userId } });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews for user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Assuming user authentication is handled

    try {
        const review = await Review.findOne({ where: { id: reviewId, userId } });

        if (!review) {
            return res.status(404).json({ message: 'Review not found or you do not have permission to update it.' });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id; // Assuming user authentication is handled

    try {
        const review = await Review.findOne({ where: { id: reviewId, userId } });

        if (!review) {
            return res.status(404).json({ message: 'Review not found or you do not have permission to delete it.' });
        }

        await review.destroy();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};