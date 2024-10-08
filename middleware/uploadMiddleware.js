const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/photo_profiles'); // Specify the directory where you want to store the files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
    }
});

// Initialize multer with storage configuration
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Set a limit of 2MB per file (optional)
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/; // Allowed file types
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

        console.log("2222");
        
        if (mimeType && extName) {
            console.log("33333");
            return cb(null, true);
        }
        const error = new Error('Invalid photo format');
        error.statusCode = 400;

    
        cb(error);
    }
});

module.exports = upload;