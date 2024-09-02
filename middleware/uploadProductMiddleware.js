const multer = require('multer');
const path = require('path');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/photo_products'); // Specify the directory where you want to store the files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

// File validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg, and .png format allowed!'), false);
    }
};

// Multer configuration
const uploadProductPhotos = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 10 }, // limit to 5MB per file and 10 files max
    fileFilter
});

module.exports = uploadProductPhotos;
