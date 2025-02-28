//cloudinary and multer are only imported in market.route.js
//bcrypt is only imported in owner.route.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//import Routes
const cityRoute = require("./routes/city.route.js");
const marketRoute = require("./routes/market.route.js");
const ownerRoute = require("./routes/owner.route.js");
const reviewRoutes = require("./routes/review.route.js");
const eventRoutes = require("./routes/event.route.js");

//environmental variables
const MongoDB_URL = process.env.MongoDB_URL;

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allow form data
//1:09:00 [1] for HTML forms (?)

//connect to mongoDB and start the server
mongoose
  .connect(MongoDB_URL) //environmental variable containing login credentials
  .then(() => {
    console.log("Connected to the database...");
    //start the server
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch(() => {
    console.log("Failed to connect to database.");
  });

//Routes (link must begin with /)
app.use("/api/city", cityRoute);
app.use("/api/market", marketRoute);
app.use("/api/owner", ownerRoute);
app.use("/api/review", reviewRoutes);
app.use("/api/event", eventRoutes);
