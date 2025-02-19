const mongoose = require("mongoose");
const Markets = require("../models/market.model"); // Assuming you have the model in the 'models' directory
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");

// Create Market (Owner Only)
exports.createMarket = async (req, res) => {
  try {
    const {
      name,
      description,
      city,
      location,
      longitude,
      latitude,
      categories,
      openingHours,
      priceList,
      socialMedia,
      logo,
      images,
    } = req.body;

    // Ensure owner is attached from middleware
    if (!req.owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Create a new market entry with image URLs
    const newMarket = new Markets({
      owner: req.owner._id, // Get owner from middleware
      name,
      description,
      city,
      location: {
        address: location,
        coordinates: [longitude, latitude], // Store coordinates as [longitude, latitude]
      },
      categories: JSON.parse(categories),
      openingHours,
      priceList,
      socialMedia: JSON.parse(socialMedia),
      logo, // Directly storing the Cloudinary URL
      images, // Directly storing the array of Cloudinary URLs
    });

    await newMarket.save();
    res
      .status(201)
      .json({ message: "Market created successfully", market: newMarket });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update Market (Owner Only)
exports.updateMarket = async (req, res) => {
  try {
    const { marketId } = req.params;
    const {
      name,
      description,
      city,
      location,
      categories,
      openingHours,
      priceList,
      socialMedia,
    } = req.body;

    const market = await Markets.findById(marketId);
    if (!market) return res.status(404).json({ error: "Market not found" });
    if (market.owner.toString() !== req.user.id)
      return res
        .status(403)
        .json({ error: "Unauthorized to update this market" });

    // Handle logo update
    const logoFile = req.files["logo"] ? req.files["logo"][0] : null;
    if (logoFile) {
      if (market.logo) {
        await cloudinary.uploader.destroy(market.logo); // Remove old image
      }
      market.logo = logoFile.path;
    }

    // Handle images update
    const imageFiles = req.files["images"] || [];
    if (imageFiles.length > 0) {
      // Delete old images
      if (market.images.length > 0) {
        await Promise.all(
          market.images.map((img) => cloudinary.uploader.destroy(img))
        );
      }
      market.images = imageFiles.map((file) => file.path);
    }

    // Update fields
    market.name = name || market.name;
    market.description = description || market.description;
    market.city = city || market.city;
    market.location = location || market.location;
    market.categories = categories ? JSON.parse(categories) : market.categories;
    market.openingHours = openingHours || market.openingHours;
    market.priceList = priceList || market.priceList;
    market.socialMedia = socialMedia
      ? JSON.parse(socialMedia)
      : market.socialMedia;

    await market.save();
    res.json({ message: "Market updated successfully", market });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete Market (Owner Only)
exports.deleteMarket = async (req, res) => {
  try {
    const { marketId } = req.params;

    const market = await Markets.findById(marketId);

    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }

    if (market.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this market" });
    }

    await market.remove();
    res.json({ message: "Market deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all markets (Everyone can access)
exports.getAllMarkets = async (req, res) => {
  try {
    const markets = await Markets.find();
    res.json({ markets });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get markets of a specific owner (Owner Only)
exports.getOwnerMarkets = async (req, res) => {
  try {
    const markets = await Markets.find({ owner: req.owner._id });
    res.json({ markets });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};
