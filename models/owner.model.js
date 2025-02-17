const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profileImage: { type: String }, // Cloudinary URL
    markets: [{ type: mongoose.Schema.Types.ObjectId, ref: "FleaMarket" }], // Owner can have multiple markets
  },
  { timestamps: true }
);

const Owner = mongoose.model("Owner", OwnerSchema);
module.exports = Owner;
