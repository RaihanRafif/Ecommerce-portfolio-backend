// controllers/userController.js
const { User, UserProfilePhoto, Wishlist } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { validationResult } = require('express-validator');
const Joi = require('joi'); // for input validation
const { ErrorHandler } = require('../utils/errorHandler');
const path = require('path'); // Import path module

const registerSchema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

exports.register = async (req, res, next) => {
    try {
        // Validate input
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { firstName, lastName, email, password } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            const error = new Error('User exists');
            error.statusCode = 401; // Status code 401 Unauthorized
            return next(error);
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user with the hashed password
        user = await User.create({ firstName, lastName, email, password: hashedPassword });

        await Wishlist.create({ name: "general", userId: user.id });


        // Respond with a success message
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Cari pengguna berdasarkan email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // Jika pengguna tidak ditemukan, kirimkan kesalahan dengan status 400
            const error = new Error('Invalid credentials');
            error.statusCode = 400;
            return next(error);
        }

        // Bandingkan password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Jika password tidak cocok, kirimkan kesalahan dengan status 400
            const error = new Error('Invalid credentials');
            error.statusCode = 400;
            return next(error);
        }

        // Buat payload dan tanda tangan token JWT
        const payload = {
            user: {
                id: user.id,
                isAdmin: user.isAdmin,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        // Kirimkan kesalahan dengan status 500 jika terjadi kesalahan di server
        error.statusCode = 500;
        return next(error);
    }
};

// Update user details
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { firstName, lastName, email } = req.body;

        let user = await User.findByPk(id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        error.statusCode = 500;
        next(error);
    }
};


// Create a profile photo
exports.createProfilePhoto = async (req, res, next) => {
    try {
        const { id } = req.user;
        const photoFilename = req.file ? path.basename(req.file.path) : null;

        console.log("1111", photoFilename);


        if (!photoFilename) {
            const error = new Error('No photo uploaded');
            error.statusCode = 400;
            return next(error);
        }

        const existingPhoto = await UserProfilePhoto.findOne({ where: { userId: id } });
        if (existingPhoto) {
            fs.unlinkSync(req.file.path);
            const error = new Error('Profile photo already exists');
            error.statusCode = 400;
            return next(error);
        }

        const profilePhoto = await UserProfilePhoto.create({ userId: id, photoUrl: photoFilename });
        res.status(201).json({ message: 'Profile photo created successfully', profilePhoto });
    } catch (error) {
        console.error('Error creating profile photo:', error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        error.statusCode = 500;
        next(error);
    }
};

// Get user profile photo
exports.getProfilePhoto = async (req, res, next) => {
    try {
        const { id } = req.user;

        const profilePhoto = await UserProfilePhoto.findOne({ where: { userId: id } });

        if (!profilePhoto) {
            const error = new Error('Profile photo not found');
            error.statusCode = 404;
            return next(error);
        }

        const photoPath = path.resolve('public/photo_profiles', profilePhoto.photoUrl);

        if (!fs.existsSync(photoPath)) {
            const error = new Error('Profile photo file not found on the server');
            error.statusCode = 404;
            return next(error);
        }

        res.sendFile(photoPath);
    } catch (error) {
        console.error('Error getting profile photo:', error);
        error.statusCode = 500;
        next(error);
    }
};


// Update a user's profile photo
exports.updateProfilePhoto = async (req, res, next) => {
    try {
        const { id } = req.user;
        const photoFilename = req.file ? path.basename(req.file.path) : null;

        if (!photoFilename) {
            const error = new Error('No photo uploaded');
            error.statusCode = 400;
            return next(error);
        }

        let profilePhoto = await UserProfilePhoto.findOne({ where: { userId: id } });
        if (!profilePhoto) {
            fs.unlinkSync(req.file.path);
            const error = new Error('Profile photo not found');
            error.statusCode = 404;
            return next(error);
        }

        if (profilePhoto.photoUrl) {
            fs.unlinkSync(path.resolve('public/photo_profiles', profilePhoto.photoUrl));
        }

        profilePhoto.photoUrl = photoFilename;
        await profilePhoto.save();

        res.status(200).json({ message: 'Profile photo updated successfully', profilePhoto });
    } catch (error) {
        console.error('Error updating profile photo:', error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        error.statusCode = 500;
        next(error);
    }
};


// Delete user profile photo
exports.deleteProfilePhoto = async (req, res, next) => {
    try {
        const { id } = req.user;

        const profilePhoto = await UserProfilePhoto.findOne({ where: { userId: id } });

        if (!profilePhoto) {
            const error = new Error('Profile photo not found');
            error.statusCode = 404;
            return next(error);
        }

        const photoPath = path.resolve('public/photo_profiles', profilePhoto.photoUrl);

        if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
        }

        await UserProfilePhoto.destroy({ where: { userId: id } });

        res.status(200).json({ message: 'Profile photo deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile photo:', error);
        error.statusCode = 500;
        next(error);
    }
};
