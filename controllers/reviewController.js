const Reviews = require("../models/review.model");
const Market = require("../models/market.model");

// Create a Review and Update Market Stats
exports.createReview = async (req, res) => {
  try {
    const { marketId, name, email, rating, comment } = req.body;

    if (!marketId || !name || !email || !rating || !comment) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure the market exists
    const market = await Market.findById(marketId);
    if (!market) return res.status(404).json({ error: "Market not found" });

    // Create and save new review
    const newReview = new Reviews({ marketId, name, email, rating, comment });
    await newReview.save();

    // Update Market Review Data
    const reviews = await Reviews.find({ marketId });

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;

    await Market.findByIdAndUpdate(marketId, {
      reviewCount: totalReviews,
      averageRating: averageRating.toFixed(1),
    });

    res
      .status(201)
      .json({ message: "Review submitted successfully", review: newReview });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { replyText } = req.body;
    const ownerId = req.owner._id; // Extract ownerId from authenticated user

    if (!replyText) {
      return res.status(400).json({ error: "Reply text is required" });
    }

    // Find the review
    const review = await Reviews.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    // Check if the authenticated user is the owner of the market
    const market = await Market.findById(review.marketId);
    if (!market || market.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({ error: "Unauthorized to reply" });
    }

    // Add the reply
    review.replies.push({ ownerId, replyText });
    await review.save();

    res.status(201).json({ message: "Reply added successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get All Reviews for a Market
exports.getMarketReviews = async (req, res) => {
  try {
    const { marketId } = req.params;
    const reviews = await Reviews.find({ marketId }).sort({ createdAt: -1 });

    if (!reviews.length) return res.json({ message: "No reviews yet" });

    res.json({ reviews });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get All Reviews for Slider
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find().populate("marketId", "name logo"); // Fetch market details
    res.json({ reviews });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};
