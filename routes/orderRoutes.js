const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID for the user.
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         totalAmount:
 *           type: number
 *         orderStatus:
 *           type: string
 *         paymentStatus:
 *           type: string
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         productSpecificId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 */

/**
 * @swagger
 * /order/create:
 *   post:
 *     summary: Create a new order from the user's cart
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []  # JWT authentication is required
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Cart not found or empty
 *       500:
 *         description: Internal server error
 */
router.post('/create', authMiddleware, orderController.createOrderFromCart);

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []  # JWT authentication is required
 *     responses:
 *       200:
 *         description: List of orders for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, orderController.getOrders);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Update an order's status or payment status
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []  # JWT authentication is required
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID of the order to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 description: The new status of the order
 *               paymentStatus:
 *                 type: string
 *                 description: The new payment status of the order
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put('/:orderId', authMiddleware, orderController.updateOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Delete an order and its items
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []  # JWT authentication is required
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID of the order to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:orderId', authMiddleware, orderController.deleteOrder);

module.exports = router;
