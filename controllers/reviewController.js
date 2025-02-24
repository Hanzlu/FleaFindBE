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
