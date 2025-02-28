const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    markets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Markets",
        required: true,
      },
    ],
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String, required: true },
    description: { type: String, required: true },
    eventType: { type: String }, // e.g., Flea Market, Special Event, etc.
    eventImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
