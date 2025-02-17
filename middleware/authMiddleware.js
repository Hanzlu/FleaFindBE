const jwt = require("jsonwebtoken");
const Owner = require("../models/owner.model"); // Ensure the correct path for the Owner model

// Middleware to check if the owner is authenticated
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from authorization header
    const token = req.header("Authorization")?.replace("Bearer ", ""); // "Bearer <token>"

    // If no token is provided
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token using JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the owner associated with the decoded token ID
    const owner = await Owner.findById(decoded.id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Attach owner to the request object
    req.owner = owner;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
