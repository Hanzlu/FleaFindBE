const mongoose = require("mongoose");
const Markets = require("../models/market.model"); // Assuming you have the model in the 'models' directory
const { validationResult } = require("express-validator");

// Create Market (Owner Only)
exports.createMarket = async (req, res) => {
  try {
    const {
      name,
      description,
      city,
      location,
      categories,
      openingHours,
      priceList,
      socialMedia,
      images,
      logo,
    } = req.body;

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newMarket = new Markets({
      owner: req.user.id, // Assuming 'req.user' is set via a middleware (authentication)
      name,
      description,
      city,
      location,
      categories,
      openingHours,
      priceList,
      socialMedia,
      images,
      logo,
    });

    await newMarket.save();
    res
      .status(201)
      .json({ message: "Market created successfully", market: newMarket });
  } catch (error) {
    console.error(error.message);
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
      images,
      logo,
    } = req.body;

    const market = await Markets.findById(marketId);

    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }

    if (market.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this market" });
    }

    market.name = name || market.name;
    market.description = description || market.description;
    market.city = city || market.city;
    market.location = location || market.location;
    market.categories = categories || market.categories;
    market.openingHours = openingHours || market.openingHours;
    market.priceList = priceList || market.priceList;
    market.socialMedia = socialMedia || market.socialMedia;
    market.images = images || market.images;
    market.logo = logo || market.logo;

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
    const markets = await Markets.find({ owner: req.user.id });
    res.json({ markets });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};
