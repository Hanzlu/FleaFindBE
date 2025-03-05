const Markets = require("../models/market.model"); // Assuming you have the model in the 'models' directory

// Create Market (Owner Only)
exports.createMarket = async (req, res) => {
  try {
    const {
      name,
      marketType,
      description,
      city,
      location,
      latitude,
      longitude,
      categories,
      openingHours,
      priceList,
      socialMedia,
      logo,
      images,
      marketNumber,
      marketEmail,
      marketWebsite,
    } = req.body;

    if (!req.owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsedLogo = logo ? JSON.parse(logo) : null;
    let parsedImages = [];

    if (images) {
      parsedImages = Array.isArray(images)
        ? images.map((image) => JSON.parse(image))
        : [JSON.parse(images)]; // Convert single image to array
    }

    const newMarket = new Markets({
      owner: req.owner._id,
      name,
      marketType,
      description,
      marketNumber,
      marketEmail,
      marketWebsite,
      city,
      location: {
        address: location,
        coordinates: [longitude, latitude],
      },
      categories: Array.isArray(categories)
        ? categories
        : JSON.parse(categories || "[]"),
      openingHours,
      priceList,
      socialMedia: socialMedia ? JSON.parse(socialMedia) : {},
      logo: parsedLogo
        ? {
            url: parsedLogo.url,
            publicId: parsedLogo.publicId,
          }
        : null,
      images: parsedImages.map((img) => ({
        url: img.url,
        publicId: img.publicId,
      })),
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
      marketType,
      description,
      city,
      logo,
      images,
      location,
      longitude,
      latitude,
      categories,
      openingHours,
      priceList,
      socialMedia,
      marketNumber,
      marketEmail,
      marketWebsite,
    } = req.body;

    const market = await Markets.findById(marketId);
    if (!market) return res.status(404).json({ error: "Market not found" });

    if (!req.owner || market.owner.toString() !== req.owner._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this market" });
    }

    const parsedLogo = logo ? JSON.parse(logo) : null;
    let parsedImages = [];

    if (images) {
      parsedImages = Array.isArray(images)
        ? images.map((image) => JSON.parse(image))
        : [JSON.parse(images)];
    }

    market.logo = parsedLogo
      ? { url: parsedLogo.url, publicId: parsedLogo.publicId }
      : market.logo;
    market.images = parsedImages.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    }));

    market.name = name || market.name;
    market.marketType = marketType || market.marketType;
    market.description = description || market.description;
    market.city = city || market.city;
    market.marketNumber = marketNumber || market.marketNumber;
    market.marketEmail = marketEmail || market.marketEmail;
    market.marketWebsite = marketWebsite || market.marketWebsite;

    if (location || longitude || latitude) {
      market.location = {
        address: location || market.location.address,
        coordinates: [
          longitude !== undefined ? longitude : market.location.coordinates[0],
          latitude !== undefined ? latitude : market.location.coordinates[1],
        ],
      };
    }

    market.categories = categories ? JSON.parse(categories) : market.categories;
    market.openingHours = openingHours || market.openingHours;
    market.priceList = priceList || market.priceList;
    market.socialMedia = socialMedia
      ? JSON.parse(socialMedia)
      : market.socialMedia;

    await market.save();
    res.json({ message: "Market updated successfully", market });
  } catch (error) {
    console.error("Server Error:", error.message);
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

    if (market.owner.toString() !== req.owner._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this market" });
    }

    await market.deleteOne();
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
