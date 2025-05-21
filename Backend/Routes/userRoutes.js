const express = require("express");
const router = express.Router();
const newUser = require("../Models/User");

// LOGIN Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  const foundUser = await newUser.findAndValidate(email, password);

  if (!foundUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    success: true,
    message: "Logged in successfully",
    user: {
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
      name: foundUser.name,
      _id: foundUser._id,
    },
  });
});

// REGISTER Route
router.post("/register", async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  if (!name || !email || !password || !confirm_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingUser = await newUser.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const user = new newUser({ name, email, password });
  await user.save();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      email: user.email,
      name: user.name,
      _id: user._id,
    },
  });
});

// LOGOUT Route (simple version)
router.post("/logout", (req, res) => {
  // Clear session or token blacklist here if implemented later
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
