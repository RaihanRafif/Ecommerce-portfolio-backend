/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: API for managing wishlists and wishlist items.
 */

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/auth'); // Assuming you have an authentication middleware

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Wishlist:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID for the wishlist.
 *         name:
 *           type: string
 *           description: Name of the wishlist.
 *         userId:
 *           type: integer
 *           description: ID of the user who owns the wishlist.
 *         products:
 *           type: array
 *           items:
 *             type: integer
 *           description: List of product IDs in the wishlist.
 *     WishlistItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID for the wishlist item.
 *         wishlistId:
 *           type: integer
 *           description: ID of the wishlist.
 *         productId:
 *           type: integer
 *           description: ID of the product.
 *         addedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the product was added to the wishlist.
 */

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Create a new wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the wishlist.
 *     responses:
 *       201:
 *         description: Wishlist created successfully.
 *       400:
 *         description: Wishlist already exists or invalid name.
 *       500:
 *         description: Internal server error.
 */
router.post('/', authMiddleware, wishlistController.createWishlist);

/**
 * @swagger
 * /wishlist/addProductToWishlist:
 *   post:
 *     summary: Add a product to a wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productSpecificId:
 *                 type: integer
 *                 description: ID of the product.
 *               wishlistGroupName:
 *                 type: string
 *                 description: Name of the wishlist group (optional, defaults to "general").
 *     responses:
 *       201:
 *         description: Product added to wishlist successfully.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/addProductToWishlist', authMiddleware, wishlistController.addProductToWishlist);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get all wishlists for the authenticated user
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wishlist'
 *       500:
 *         description: Internal server error.
 */
router.get('/', authMiddleware, wishlistController.getWishlists);

/**
 * @swagger
 * /wishlist/{id}:
 *   patch:
 *     summary: Update a wishlist name
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the wishlist.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the wishlist.
 *     responses:
 *       200:
 *         description: Wishlist updated successfully.
 *       404:
 *         description: Wishlist not found.
 *       500:
 *         description: Internal server error.
 */
router.patch('/:id', authMiddleware, wishlistController.updateWishlist);

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     summary: Delete a wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the wishlist.
 *     responses:
 *       200:
 *         description: Wishlist deleted successfully.
 *       404:
 *         description: Wishlist not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', authMiddleware, wishlistController.deleteWishlist);

/**
 * @swagger
 * /wishlist/{wishlistId}/{productId}:
 *   delete:
 *     summary: Remove a product from a wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wishlistId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the wishlist.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to remove.
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully.
 *       404:
 *         description: Product not found in the wishlist.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:wishlistId/:productId', authMiddleware, wishlistController.removeWishlistItem);

module.exports = router;
