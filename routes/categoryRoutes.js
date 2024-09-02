const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth'); // Assuming you have an authentication middleware

// Route to create a new category (Admin only)
router.post('/', authMiddleware, categoryController.createCategory);

// Route to get all categories (Accessible to all users)
router.get('/', categoryController.getCategories);

// Route to update a category by ID (Admin only)
router.patch('/:id', authMiddleware, categoryController.updateCategory);

// Route to delete a category by ID (Admin only)
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
