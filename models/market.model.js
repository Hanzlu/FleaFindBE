const mongoose = require("mongoose");

const MarketsSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    name: { type: String, required: true },
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
    images: [{ type: String }], // Array of Cloudinary URLs
    logo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Markets", MarketsSchema);
