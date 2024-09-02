// controllers/wishlistController.js
const { isUser } = require('../middleware/authorizationMiddleware');
const { Wishlist, Product, WishlistItem } = require('../models');

exports.createWishlist = async (req, res) => {
    try {
        const { name } = req.body;

        if (req.user.isAdmin == true) {
            return res.status(401).json({ message: 'Only user can create wishlist' });
        }

        const existingWishlist = await Wishlist.findOne({ where: { userId: req.user.id, name } });
        if (existingWishlist) {
            return res.status(400).json({ message: 'Wishlist group already exists' });
        }

        if (name == "general") {
            return res.status(400).json({ message: "Can't use this name for wishlist" });
        }

        const wishlist = await Wishlist.create({
            userId: req.user.id,
            name,
        });

        res.status(201).json({ message: 'Wishlist group created successfully', wishlist });
    } catch (error) {
        console.error('Error creating wishlist:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.appProductToWishlist = async (req, res) => {
    try {
        const { productSpecificId, wishlistGroupName = "general" } = req.body;
        const userId = req.user.id

        if (!userId) {
            return res.status(404).json({ message: 'Authentication Error' });
        }

        // Check if the product exists
        const product = await Product.findByPk(productSpecificId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if a wishlist group with the specified name exists
        let wishlistGroup = await Wishlist.findOne({ where: { name: wishlistGroupName, userId } });

        if (!wishlistGroup) {
            // Create a new wishlist group if not found
            wishlistGroup = await Wishlist.create({ name: wishlistGroupName, userId });
        }


        // Add the product to the wishlist group
        const wishlist = await WishlistItem.create({
            wishlistId: wishlistGroup.id,
            productSpecificId: productSpecificId
        })

        res.status(201).json({ message: 'Product added to wishlist successfully', data: wishlist },);
    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getWishlists = async (req, res) => {
    try {
        // Fetch all wishlists for the user
        const wishlists = await Wishlist.findAll({
            where: { userId: req.user.id },  // Updated from UserId to userId to match the model definition
        });

        // If no wishlists are found, return an empty array
        if (!wishlists || wishlists.length === 0) {
            return res.status(200).json([]);
        }

        // Fetch all wishlist items for the fetched wishlists
        const wishlistIds = wishlists.map(wishlist => wishlist.id); // Extract the ids of the fetched wishlists
        const wishlistItems = await WishlistItem.findAll({
            where: { wishlistId: wishlistIds },  // Fetch all items where wishlistId is in the fetched wishlist ids
        });

        // Combine wishlists with their respective items
        const wishlistsWithItems = wishlists.map(wishlist => {
            // Filter wishlist items that belong to the current wishlist
            const itemsForThisWishlist = wishlistItems.filter(item => item.wishlistId === wishlist.id);
            return {
                ...wishlist.toJSON(),  // Convert Sequelize model instance to a plain object
                items: itemsForThisWishlist,  // Add a new field 'items' containing the relevant wishlist items
            };
        });

        res.status(200).json(wishlistsWithItems);
    } catch (error) {
        console.error('Error fetching wishlists:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateWishlist = async (req, res) => {
    const { id } = req.params; // Get wishlistId from request parameters
    const { name } = req.body; // Get the new name from request body

    try {
        // Find the wishlist by its ID and user's ID to ensure the user owns it
        const wishlist = await Wishlist.findOne({
            where: { id, userId: req.user.id }
        });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found or not authorized' });
        }

        // Update the wishlist name
        wishlist.name = name;
        await wishlist.save(); // Save the changes

        res.status(200).json({ message: 'Wishlist name updated successfully', wishlist });
    } catch (error) {
        console.error('Error updating wishlist name:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.removeWishlistItem = async (req, res) => {
    const { wishlistId, productId } = req.params; // Get wishlistItemId from request parameters

    try {
        // Find the wishlist item by its ID
        const wishlistItem = await WishlistItem.findOne({
            where: {
                wishlistId,
                productSpecificId: productId
            }
        });

        if (!wishlistItem) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        // Check if the wishlist item belongs to the current user
        // Assume req.user.id is available from authentication middleware
        const userWishlist = await Wishlist.findOne({
            where: { id: wishlistId, userId: req.user.id }
        });

        if (!userWishlist) {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        // Delete the wishlist item
        await wishlistItem.destroy();

        res.status(200).json({ message: 'Wishlist item removed successfully' });
    } catch (error) {
        console.error('Error removing wishlist item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const wishlist = await Wishlist.findByPk(id);

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        await wishlist.destroy();
        res.status(200).json({ message: 'Wishlist deleted successfully' });
    } catch (error) {
        console.error('Error deleting wishlist:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
