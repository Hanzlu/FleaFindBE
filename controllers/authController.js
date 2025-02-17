const Owner = require("../models/owner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Owner Registration
exports.registerOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner)
      return res.status(400).json({ message: "Email already exists" });

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const owner = new Owner({
      name,
      email,
      password: hashedPassword, // Store the hashed password
    });

    await owner.save();

    res.status(201).json({ message: "Owner registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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
