const Events = require("../models/event.model"); // Event Model
const Markets = require("../models/market.model"); // Market Model (to link events to markets)

// Create Event (Owner Only)
exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      marketIds,
      eventDate,
      eventTime,
      eventLocation,
      eventDescription,
      eventCategory,
      eventImage,
    } = req.body;

    if (!req.owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let selectedMarkets = [];
    if (marketIds.includes("all")) {
      selectedMarkets = await Markets.find({ owner: req.owner._id }).select(
        "_id"
      );
    } else {
      selectedMarkets = await Markets.find({ _id: { $in: marketIds } }).select(
        "_id"
      );
    }

    if (!selectedMarkets.length) {
      return res.status(404).json({ message: "No valid markets found" });
    }

    const parsedImage = eventImage ? JSON.parse(eventImage) : null;
    const newEvent = new Events({
      owner: req.owner._id,
      name: eventName,
      description: eventDescription,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      eventType: eventCategory,
      eventImage: {
        url: parsedImage.url,
        publicId: parsedImage.publicId,
      },
      markets: selectedMarkets.map((m) => m._id),
    });

    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};
// Update Event (Owner Only)
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      eventName,
      marketIds,
      eventDate,
      eventTime,
      eventLocation,
      eventDescription,
      eventCategory,
      eventImage,
    } = req.body;

    // Find the event by ID
    const event = await Events.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Ensure the owner is authorized to update the event
    if (!req.owner || event.owner.toString() !== req.owner._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this event" });
    }

    // Process the marketIds
    let selectedMarkets = [];
    if (marketIds.includes("all")) {
      selectedMarkets = await Markets.find({ owner: req.owner._id }).select(
        "_id"
      );
    } else {
      selectedMarkets = await Markets.find({ _id: { $in: marketIds } }).select(
        "_id"
      );
    }

    if (!selectedMarkets.length) {
      return res.status(404).json({ message: "No valid markets found" });
    }

    // Parse the event image if provided
    const parsedImage = eventImage ? JSON.parse(eventImage) : null;

    // Update event fields
    event.name = eventName || event.name;
    event.description = eventDescription || event.description;
    event.date = eventDate || event.date;
    event.time = eventTime || event.time;
    event.location = eventLocation || event.location;
    event.eventType = eventCategory || event.eventType;
    event.eventImage = parsedImage
      ? { url: parsedImage.url, publicId: parsedImage.publicId }
      : event.eventImage;
    event.markets = selectedMarkets.map((m) => m._id);

    // Save the updated event
    await event.save();

    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete Event (Owner Only)
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Events.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Ensure the owner is authorized to delete the event
    if (!req.owner || event.owner.toString() !== req.owner._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get All Events (Everyone can access)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Events.find();
    res.json({ events });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Events by Market ID (Everyone can access)
exports.getEventsByMarket = async (req, res) => {
  try {
    const { marketId } = req.params;

    const events = await Events.find({ market: marketId });
    res.json({ events });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Events by Owner (Owner Only)
exports.getOwnerEvents = async (req, res) => {
  try {
    const events = await Events.find({ owner: req.owner._id });
    res.json({ events });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};
