const express = require('express');
const router = express.Router();
const multer = require('multer');
const productPhotoController = require('../controllers/productPhotoController');
const authMiddleware = require('../middleware/auth');

const upload = multer({ dest: 'public/photo_products' }); // Configure multer for handling file uploads

/**
 * @swagger
 * tags:
 *   name: ProductPhotos
 *   description: Product photo management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductPhoto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID for the photo.
 *         productId:
 *           type: integer
 *           description: ID of the associated product.
 *         imageUrl:
 *           type: string
 *           description: URL of the uploaded photo.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the photo was uploaded.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the photo was last updated.
 */

/**
 * @swagger
 * /product-photo:
 *   post:
 *     summary: Upload photos for a product
 *     tags: [ProductPhotos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of product photos to upload
 *               productId:
 *                 type: string
 *                 description: The ID of the product
 *     responses:
 *       201:
 *         description: Photos uploaded successfully
 *       400:
 *         description: Maximum of 10 photos exceeded
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, upload.array('photos', 10), productPhotoController.uploadPhotos);

/**
 * @swagger
 * /product-photo/{productId}:
 *   get:
 *     summary: Get all photos for a product
 *     tags: [ProductPhotos]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: List of photos for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductPhoto'
 *       404:
 *         description: No photos found for this product
 *       500:
 *         description: Internal server error
 */
router.get('/:productId', productPhotoController.getPhotosByProduct);

/**
 * @swagger
 * /product-photo/{id}:
 *   put:
 *     summary: Update a photo for a product (Admin only)
 *     tags: [ProductPhotos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the photo to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: The new image URL
 *     responses:
 *       200:
 *         description: Photo updated successfully
 *       404:
 *         description: Photo not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, productPhotoController.updatePhoto);

/**
 * @swagger
 * /product-photo/{id}:
 *   delete:
 *     summary: Delete a photo from a product (Admin only)
 *     tags: [ProductPhotos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the photo to delete
 *     responses:
 *       200:
 *         description: Photo deleted successfully
 *       404:
 *         description: Photo not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, productPhotoController.deletePhoto);

module.exports = router;
