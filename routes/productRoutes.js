const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth'); // Middleware to authenticate the user
const uploadProductPhotos = require('../middleware/uploadProductMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID for the product.
 *         name:
 *           type: string
 *           description: Name of the product.
 *         description:
 *           type: string
 *           description: Description of the product.
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product.
 *         categoryId:
 *           type: integer
 *           description: ID of the category the product belongs to.
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Array of product photos.
 *         specification:
 *           type: string
 *           description: Specification details of the product.
 *         length:
 *           type: number
 *           format: float
 *           description: Length of the product.
 *         width:
 *           type: number
 *           format: float
 *           description: Width of the product.
 *         height:
 *           type: number
 *           format: float
 *           description: Height of the product.
 *         material:
 *           type: string
 *           description: Material of the product.
 *         style:
 *           type: string
 *           description: Style of the product.
 *         color:
 *           type: string
 *           description: Color of the product.
 *         size:
 *           type: string
 *           description: Size of the product.
 *         stock:
 *           type: number
 *           description: Number of items in stock.
 *         weight:
 *           type: number
 *           format: float
 *           description: Weight of the product.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the product was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the product was last updated.
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               specification:
 *                 type: string
 *               length:
 *                 type: number
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *               material:
 *                 type: string
 *               style:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               stock:
 *                 type: number
 *               weight:
 *                 type: number
 *     responses:
 *       201:
 *         description: The product was successfully created
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, uploadProductPhotos.array('photos', 10), productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id?', productController.getProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               specification:
 *                 type: string
 *               length:
 *                 type: number
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *               material:
 *                 type: string
 *               style:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               stock:
 *                 type: number
 *               weight:
 *                 type: number
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *       404:
 *         description: Product not found
 */
router.put('/:id', authMiddleware, uploadProductPhotos.array('photos', 10), productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
