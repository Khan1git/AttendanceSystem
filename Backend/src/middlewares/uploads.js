import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configure the storage destination and filename format
const imageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "./Uploads";

        // Check if the directory exists; if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}-${file.originalname}`); // Unique filename
    }
});

// Image filter to allow only image files
const isImage = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only Images are allowed"), false); // Reject the file
    }
};

// Set up multer with the defined configuration and file filter
const uploads = multer({
    storage: imageConfig,
    fileFilter: isImage
});

export default uploads;
