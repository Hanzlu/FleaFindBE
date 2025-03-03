const Owner = require("../models/owner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Incoming request body:", req.body); // Debugging line

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = new Owner({ name, email, password: hashedPassword });

    await owner.save();
    res.status(201).json({ message: "Owner registered successfully" });
  } catch (err) {
    console.error("Error registering owner:", err); // Log error for debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Owner Login
exports.loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if owner exists
    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, ownerId: owner._id, name: owner.name });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Owner Info (Email & Password)
exports.updateOwnerInfo = async (req, res) => {
  try {
    const { ownerId, email, newPassword, currentPassword } = req.body;

    // Find the owner by ID
    const owner = await Owner.findById(ownerId);
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    // Validate if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, owner.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    // Check if the new email is already taken
    if (email && email !== owner.email) {
      const existingOwner = await Owner.findOne({ email });
      if (existingOwner)
        return res.status(400).json({ message: "Email is already in use" });
    }

    // Update email if provided
    if (email) owner.email = email;

    // Hash the new password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      owner.password = hashedPassword;
    }

    // Save the updated owner data
    await owner.save();

    res.status(200).json({ message: "Owner information updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
