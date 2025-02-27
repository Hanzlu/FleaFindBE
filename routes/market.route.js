const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const marketController = require("../controllers/marketController");
const authMiddleware = require("../middleware/authMiddleware"); // Assuming you have an auth middleware to verify JWT and user permissions
const uploadFields = require("../middleware/uploadMiddleware"); // Import new upload middleware

// Create a Market (Owner only)
router.post(
  "/",
  authMiddleware,
  uploadFields,
  [
    check("name", "Market name is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("location", "Location is required").not().isEmpty(),
    check("openingHours", "Opening hours are required").not().isEmpty(),
    check("priceList", "Price list is required").not().isEmpty(),
  ],
  marketController.createMarket
);

// Update a Market (Owner only)
router.put(
  "/update/:marketId",
  authMiddleware,
  uploadFields,
  marketController.updateMarket
);

// Delete a Market (Owner only)
router.delete("/:marketId", authMiddleware, marketController.deleteMarket);

// Get all Markets (Everyone can access)
router.get("/", marketController.getAllMarkets);

// Get Owner's Markets (Owner only)
router.get("/owner", authMiddleware, marketController.getOwnerMarkets);

module.exports = router;
