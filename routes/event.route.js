const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const eventController = require("../controllers/eventsController");
const authMiddleware = require("../middleware/authMiddleware"); // For user authorization
const uploadFields = require("../middleware/uploadMiddleware"); // For image uploads

// Create Event (Owner only)
router.post(
  "/",
  authMiddleware,
  uploadFields,
  [
    check("name", "Event name is required").not().isEmpty(),
    check("marketId", "Market ID is required").not().isEmpty(),
    check("date", "Event date is required").not().isEmpty(),
    check("location", "Event location is required").not().isEmpty(),
    check("description", "Event description is required").not().isEmpty(),
    check("category", "Event Category is required").not().isEmpty(),
  ],
  eventController.createEvent
);

// Update Event (Owner only)
router.put(
  "/update/:eventId",
  authMiddleware,
  uploadFields,
  eventController.updateEvent
);

// Delete Event (Owner only)
router.delete("/:eventId", authMiddleware, eventController.deleteEvent);

// Get all Events (Everyone can access)
router.get("/", eventController.getAllEvents);

// Get Events by Market ID (Everyone can access)
router.get("/market/:marketId", eventController.getEventsByMarket);

// Get Events by Owner (Owner only)
router.get("/owner", authMiddleware, eventController.getOwnerEvents);

module.exports = router;
