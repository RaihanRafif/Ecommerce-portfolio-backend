const { Cart, CartItem } = require('../models');

// Create or update product in the cart
exports.addProductToCart = async (req, res, next) => {
    try {
        const { specificProductId, totalProduct, note } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!specificProductId || totalProduct === undefined) {
            const error = new Error('Specific product ID and total product are required');
            error.statusCode = 400;
            throw error;
        }

        // Find or create a cart for the user
        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId });
        }

        // Check if the product already exists in the cart
        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, specificProductId }
        });

        if (cartItem) {
            // If the product already exists, update the quantity
            cartItem.totalProduct += totalProduct;
            if (note) cartItem.note = note; // Update note if provided
            await cartItem.save();
        } else {
            // If the product does not exist, add it to the cart
            await CartItem.create({
                cartId: cart.id,
                specificProductId,
                totalProduct,
                note
            });
        }

        res.status(201).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};

// Update product quantity in the cart
exports.updateProductQuantity = async (req, res, next) => {
    try {
        const { specificProductId, totalProduct } = req.body;
        const userId = req.user.id;

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            const error = new Error('Cart not found');
            error.statusCode = 404;
            throw error;
        }

        const cartItem = await CartItem.findOne({
            where: { cartId: cart.id, specificProductId }
        });

        if (!cartItem) {
            const error = new Error('Product not found in cart');
            error.statusCode = 404;
            throw error;
        }

        cartItem.totalProduct = totalProduct;
        await cartItem.save();

        res.status(200).json({ message: 'Product quantity updated successfully' });
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};

// Remove a product from the cart
exports.removeProductFromCart = async (req, res, next) => {
    try {
        const { specificProductId } = req.body;
        const userId = req.user.id;

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            const error = new Error('Cart not found');
            error.statusCode = 404;
            throw error;
        }

        const cartItem = await CartItem.findOne({
            where: { cartId: cart.id, specificProductId }
        });

        if (!cartItem) {
            const error = new Error('Product not found in cart');
            error.statusCode = 404;
            throw error;
        }

        await cartItem.destroy();

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};

// View the cart with all products and their quantities
exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items'
            }]
        });

        if (!cart) {
            const error = new Error('Cart not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(cart);
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};
