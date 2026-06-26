const express = require("express");
const router = express.Router();

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/authController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profile
router.get("/profile", authMiddleware, getProfile);

// Temporary Make Admin
router.get("/make-admin", async (req, res) => {
  try {

    const user = await User.findOneAndUpdate(
      { email: "pooja@test.com" },
      {
        role: "admin",
        createdBy: null
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Admin created successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;