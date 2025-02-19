const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });

// Middleware to handle file uploads
const uploadFields = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "images", maxCount: 10 }, // Max 10 images for flea market
]);

module.exports = uploadFields;
