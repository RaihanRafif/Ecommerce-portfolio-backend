const { Category } = require('../models');

// Middleware to check if the user is an admin
const isAdmin = (req) => {
    return req.user && req.user.isAdmin; // Ensure req.user exists and has isAdmin property
};

// Create a new category
exports.createCategory = async (req, res, next) => {
    try {
        if (!isAdmin(req)) {
            const error = new Error('Access denied: Admins only');
            error.statusCode = 403;
            throw error;
        }

        const { name, description } = req.body;

        // Validate input
        if (!name) {
            const error = new Error('Category name is required');
            error.statusCode = 400;
            throw error;
        }

        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};

// Get all categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};

// Update a category
exports.updateCategory = async (req, res, next) => {
    try {
        if (!isAdmin(req)) {
            const error = new Error('Access denied: Admins only');
            error.statusCode = 403;
            throw error;
        }

        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByPk(id);

        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        // Update category details
        category.name = name || category.name; // Only update if provided
        category.description = description || category.description;
        await category.save();

        res.status(200).json(category);
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
    try {
        if (!isAdmin(req)) {
            const error = new Error('Access denied: Admins only');
            error.statusCode = 403;
            throw error;
        }

        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        await category.destroy();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};
