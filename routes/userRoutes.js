const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

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
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /update:
 *   patch:
 *     summary: Update user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/update', authMiddleware, userController.updateUser);

/**
 * @swagger
 * /profile-photo:
 *   post:
 *     summary: Upload a new profile photo
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile photo created successfully
 *       400:
 *         description: No photo uploaded or profile photo already exists
 *       500:
 *         description: Internal server error
 */
router.post('/profile-photo', authMiddleware, upload.single('photo'), userController.createProfilePhoto);

/**
 * @swagger
 * /profile-photo:
 *   get:
 *     summary: Get user profile photo
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile photo retrieved successfully
 *       404:
 *         description: Profile photo not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile-photo', authMiddleware, userController.getProfilePhoto);

/**
 * @swagger
 * /profile-photo:
 *   patch:
 *     summary: Update user profile photo
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile photo updated successfully
 *       400:
 *         description: No photo uploaded
 *       404:
 *         description: Profile photo not found
 *       500:
 *         description: Internal server error
 */
router.patch('/profile-photo', authMiddleware, upload.single('photo'), userController.updateProfilePhoto);

/**
 * @swagger
 * /profile-photo:
 *   delete:
 *     summary: Delete user profile photo
 *     tags: [Profile Photo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile photo deleted successfully
 *       404:
 *         description: Profile photo not found
 *       500:
 *         description: Internal server error
 */
router.delete('/profile-photo', authMiddleware, userController.deleteProfilePhoto);

module.exports = router;
