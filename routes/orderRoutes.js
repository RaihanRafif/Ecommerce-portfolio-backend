const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth'); // Assuming you have an authentication middleware

// Create a new order from the cart
router.post('/create', authMiddleware, orderController.createOrderFromCart);

// Get all orders for the authenticated user
router.get('/', authMiddleware, orderController.getOrders);

// Update an order's status or payment status
router.put('/:orderId', authMiddleware, orderController.updateOrder);

// Delete an order and its items
router.delete('/:orderId', authMiddleware, orderController.deleteOrder);

module.exports = router;
