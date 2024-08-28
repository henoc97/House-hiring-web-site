const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Define the upload directory and ensure it exists
const uploadDir = path.join(__dirname, '../frontend/img/');

/**
 * Ensures the upload directory exists.
 */
const ensureUploadDirExists = () => {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
};

// Ensure that the upload directory exists
ensureUploadDirExists();

/**
 * Multer storage configuration.
 */
const storage = multer.diskStorage({
    /**
     * Define the destination for file uploads.
     * 
     * @param {Object} req - The request object.
     * @param {Object} file - The file object.
     * @param {Function} cb - The callback function to be invoked.
     */
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    
    /**
     * Define the filename for the uploaded file.
     * 
     * @param {Object} req - The request object.
     * @param {Object} file - The file object.
     * @param {Function} cb - The callback function to be invoked.
     */
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

/**
 * Multer upload middleware configuration.
 */
const upload = multer({ storage: storage });

module.exports = { upload };
