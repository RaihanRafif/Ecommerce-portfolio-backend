// controllers/productPhotoController.js
const { ProductPhoto, Product } = require('../models');
const fs = require('fs');

// Middleware to check if the user is admin
const checkAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

// Upload multiple photos
exports.uploadPhotos = async (req, res) => {
    try {
        const { productId } = req.body;
        const files = req.files;

        // Get the current count of photos for the product
        const existingPhotosCount = await ProductPhoto.count({
            where: { productId }
        });

        // Check if the total number of photos exceeds 8
        if (existingPhotosCount + files.length > 8) {
            return res.status(400).json({ message: 'You can only upload a maximum of 8 photos per product.' });
        }

        // Loop through files and save each photo entry in the database
        const photoEntries = files.map(file => ({
            productId: productId,
            imageUrl: `/uploads/${file.filename}`
        }));

        await ProductPhoto.bulkCreate(photoEntries);

        res.status(201).json({ message: 'Photos uploaded successfully.' });
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Get all photos for a product
exports.getPhotosByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const photos = await ProductPhoto.findAll({ where: { productId } });
        if (photos.length === 0) {
            return res.status(404).json({ message: 'No photos found for this product' });
        }

        res.status(200).json(photos);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update a photo for a product
exports.updatePhoto = [checkAdmin, async (req, res) => {
    try {
        const { id } = req.params; // Photo ID
        const { imageUrl } = req.body;

        const photo = await ProductPhoto.findByPk(id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        photo.imageUrl = imageUrl;
        await photo.save();

        res.status(200).json(photo);
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}];

// Delete a photo from a product
exports.deletePhoto = [checkAdmin, async (req, res) => {
    try {
        const { id } = req.params; // Photo ID

        const photo = await ProductPhoto.findByPk(id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        await photo.destroy();
        res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}];
