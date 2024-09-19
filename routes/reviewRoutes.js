const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth'); // Middleware to ensure user is authenticated

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID for the review.
 *         productId:
 *           type: integer
 *           description: ID of the product being reviewed.
 *         userId:
 *           type: integer
 *           description: ID of the user who made the review.
 *         rating:
 *           type: integer
 *           description: Rating given to the product (1-5).
 *         comment:
 *           type: string
 *           description: Comment about the product.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the review was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the review was last updated.
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review for a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID of the product to review
 *               rating:
 *                 type: integer
 *                 description: Rating of the product (1-5)
 *               comment:
 *                 type: string
 *                 description: Comment about the product
 *     responses:
 *       201:
 *         description: Review created successfully
 *       403:
 *         description: You can only review products you have purchased
 *       400:
 *         description: You have already reviewed this product
 */
router.post('/', authMiddleware, reviewController.createReview);

/**
 * @swagger
 * /reviews/{productId}:
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: List of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Product not found
 */
router.get('/:productId', reviewController.getReviewsByProduct);

/**
 * @swagger
 * /reviews/user/{userId}:
 *   get:
 *     summary: Get all reviews by a specific user
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of reviews by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: User or reviews not found
 */
router.get('/user/:userId', authMiddleware, reviewController.getReviewsByUser);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 */
router.put('/:reviewId', authMiddleware, reviewController.updateReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router;
