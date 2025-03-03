const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    marketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Markets",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    replies: [
      {
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
        replyText: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reviews", ReviewSchema);
