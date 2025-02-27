const mongoose = require("mongoose");

const MarketsSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    name: { type: String, required: true },
    marketType: { type: String, required: true },
    description: { type: String },
    city: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      coordinates: { type: [Number], index: "2dsphere" }, // [longitude, latitude]
    },
    categories: [{ type: String }],
    openingHours: { type: String, required: false },
    priceList: { type: String },
    socialMedia: {
      twitter: String,
      facebook: String,
      instagram: String,
    },
    images: [
      {
        url: { type: String, required: true }, // Cloudinary URL
        publicId: { type: String, required: true }, // Cloudinary publicId
      },
    ], // Array of objects with url and publicId
    logo: {
      url: { type: String, required: true }, // Cloudinary URL
      publicId: { type: String, required: true }, // Cloudinary publicId
    },
    reviewCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    marketNumber: { type: String, required: false },
    marketEmail: { type: String, required: false },
    marketWebsite: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Markets", MarketsSchema);
