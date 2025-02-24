const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Create a review (Anyone can post)
router.post("/", reviewController.createReview);

// Get reviews for a specific market
router.get("/:marketId", reviewController.getMarketReviews);

// Get average rating for a specific market
router.get("/", reviewController.getAllReviews);

module.exports = router;
