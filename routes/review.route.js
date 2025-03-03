const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure only owners can reply

// Create a review (Anyone can post)
router.post("/", reviewController.createReview);

// Get reviews for a specific market
router.get("/:marketId", reviewController.getMarketReviews);

// Get average rating for a specific market
router.get("/", reviewController.getAllReviews);

// Reply to a review (Owner only)
router.post("/reply/:reviewId", authMiddleware, reviewController.replyToReview);

module.exports = router;
