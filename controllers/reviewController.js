const { Review, Order, OrderItem } = require('../models'); // Import necessary models
const { sequelize } = require('../models');

// Create a review for a product
exports.createReview = async (req, res, next) => {
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
        next(error); // Pass error to error handler
    }
};

// Get all reviews for a specific product
exports.getReviewsByProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const reviews = await Review.findAll({ where: { productId } });
        res.status(200).json(reviews);
    } catch (error) {
        next(error); // Pass error to error handler
    }
};

// Get all reviews by a specific user
exports.getReviewsByUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const reviews = await Review.findAll({ where: { userId } });
        res.status(200).json(reviews);
    } catch (error) {
        next(error); // Pass error to error handler
    }
};

// Update a review
exports.updateReview = async (req, res, next) => {
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
        next(error); // Pass error to error handler
    }
};

// Delete a review
exports.deleteReview = async (req, res, next) => {
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
        next(error); // Pass error to error handler
    }
};
