// controllers/productController.js
const { Product, Category, ProductPhoto, ProductSpecifics, ProductSpesificDetail, SpesificDetail } = require('../models');
const fs = require('fs');
const path = require('path');

// Middleware to check if the user is admin
const checkAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

// Updated createProduct with file upload
exports.createProduct = [checkAdmin, async (req, res) => {
    try {
        let { name, description, price, categoryId, length, width, height, status = "new", material, style, color, size, stock, weight } = req.body;

        // Parse specification string into JSON
        let spesification = JSON.parse(req.body.spesification);

        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        spesification.length > 0 ? price = 0 : '';
        spesification.length > 0 ? color = '' : '';
        spesification.length > 0 ? stock = 0 : '';

        const product = await Product.create({
            name,
            description,
            price,
            categoryId,
            size,
            length,
            width,
            height,
            status,
            material,
            style,
            color,
            stock,
            weight
        });

        if (!product.id) {
            return res.status(404).json({ message: 'Create product failed' });
        }

        // Handle specifications
        if (spesification.length > 0) {
            const productSpesificDetails = spesification.map((e) => ({
                productId: product.id,
                productSpesificId: e.productSpesificId,
                spesificDetailId: e.spesificDetailId,
                stock: e.stock,
                price: e.price,
            }));

            // Use bulkCreate to insert multiple specifications
            await ProductSpesificDetail.bulkCreate(productSpesificDetails);
        }

        // Handle uploaded product photos
        if (req.files && req.files.length > 0) {
            const productPhotos = req.files.map((file) => ({
                productId: product.id,
                imageUrl: `/photo_products/${file.filename}`, // Assuming the path is relative to the 'public' folder
            }));

            // Insert photo URLs into the ProductPhoto table
            await ProductPhoto.bulkCreate(productPhotos);
        }

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}];


exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get the product ID from the request parameters

        if (id) {
            // Find a specific product by its ID
            const product = await Product.findOne({
                where: { id },
                attributes: [
                    'id', 'name', 'description', 'price', 'length', 'width', 'height',
                    'weight', 'size', 'status', 'material', 'style', 'color', 'stock', 'categoryId'
                ] // Only fetch necessary fields
            });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Get product specifications
            const productSpesificationDetails = await ProductSpesificDetail.findAll({
                where: { productId: id }
            });

            let productSpesification = [];
            if (productSpesificationDetails.length > 0) {
                const spesificationPromises = productSpesificationDetails.map(async (e) => {
                    const spesification = await ProductSpecifics.findOne({
                        where: { id: e.productSpesificId },
                        attributes: ['name']
                    });
                    const detailSpesification = await SpesificDetail.findOne({
                        where: { id: e.spesificDetailId },
                        attributes: ['name']
                    });

                    return {
                        spesification: spesification ? spesification.name : null,
                        detailSpesification: detailSpesification ? detailSpesification.name : null,
                        price: e.price,
                        stock: e.stock
                    };
                });

                productSpesification = await Promise.all(spesificationPromises);
            }

            // Get product photos
            const productPhotos = await ProductPhoto.findAll({
                where: { productId: id },
                attributes: ['imageUrl']
            });

            res.status(200).json({
                product,
                productSpesification,
                photos: productPhotos.map(photo => photo.imageUrl)
            });

        } else {
            // Get all products
            const allProducts = await Product.findAll({
                attributes: [
                    'id', 'name', 'description', 'price', 'length', 'width', 'height',
                    'weight', 'size', 'status', 'material', 'style', 'color', 'stock', 'categoryId'
                ] // Only fetch necessary fields
            });

            // Fetch specifications and photos for each product
            const allProductsPromises = allProducts.map(async (product) => {
                // Fetch product specifications
                const productSpesificationDetails = await ProductSpesificDetail.findAll({
                    where: { productId: product.id }
                });

                let productSpesification = [];
                if (productSpesificationDetails.length > 0) {
                    const spesificationPromises = productSpesificationDetails.map(async (e) => {
                        const spesification = await ProductSpecifics.findOne({
                            where: { id: e.productSpesificId },
                            attributes: ['name']
                        });
                        const detailSpesification = await SpesificDetail.findOne({
                            where: { id: e.spesificDetailId },
                            attributes: ['name']
                        });

                        return {
                            spesification: spesification ? spesification.name : null,
                            detailSpesification: detailSpesification ? detailSpesification.name : null,
                            price: e.price,
                            stock: e.stock
                        };
                    });

                    productSpesification = await Promise.all(spesificationPromises);
                }

                // Fetch product photos
                const productPhotos = await ProductPhoto.findAll({
                    where: { productId: product.id },
                    attributes: ['imageUrl']
                });

                return {
                    product,
                    productSpesification,
                    photos: productPhotos.map(photo => photo.imageUrl)
                };
            });

            const products = await Promise.all(allProductsPromises);
            res.status(200).json(products);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get the product ID from the request parameters

        // Find the product to ensure it exists
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find product photos to delete them from the server
        const productPhotos = await ProductPhoto.findAll({ where: { productId: id } });
        if (productPhotos.length > 0) {
            // Delete each photo from the server
            productPhotos.forEach((photo) => {
                const filePath = path.join(__dirname, '../public', photo.imageUrl);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting photo from server:', err);
                    }
                });
            });

            // Delete product photos from the database
            await ProductPhoto.destroy({ where: { productId: id } });
        }

        // Delete product specifications
        await ProductSpesificDetail.destroy({ where: { productId: id } });

        // Delete the product
        await product.destroy();

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get the product ID from the request parameters

        let { name, description, price, categoryId, length, width, height, status = "new", material, style, color, size, stock, weight } = req.body;
        let spesification = JSON.parse(req.body.spesification); // Parse specifications string into JSON

        // Find the product to ensure it exists
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product details
        await product.update({
            name,
            description,
            price,
            categoryId,
            size,
            length,
            width,
            height,
            status,
            material,
            style,
            color,
            stock,
            weight
        });

        // Handle product photos if any are provided
        if (req.files && req.files.length > 0) {
            // Find existing photos to delete from the server
            const existingPhotos = await ProductPhoto.findAll({ where: { productId: id } });
            if (existingPhotos.length > 0) {
                existingPhotos.forEach((photo) => {
                    const filePath = path.join(__dirname, '../public', photo.imageUrl);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting old photo from server:', err);
                        }
                    });
                });

                // Delete existing photos from the database
                await ProductPhoto.destroy({ where: { productId: id } });
            }

            // Add new photos
            const productPhotos = req.files.map((file) => ({
                productId: product.id,
                imageUrl: `/photo_products/${file.filename}`,
            }));
            await ProductPhoto.bulkCreate(productPhotos);
        }

        // Handle specifications
        if (spesification.length > 0) {
            // Delete existing specifications
            await ProductSpesificDetail.destroy({ where: { productId: id } });

            // Insert new specifications
            const productSpesificDetails = spesification.map((e) => ({
                productId: product.id,
                productSpesificId: e.productSpesificId,
                spesificDetailId: e.spesificDetailId,
                stock: e.stock,
                price: e.price,
            }));
            await ProductSpesificDetail.bulkCreate(productSpesificDetails);
        }

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
