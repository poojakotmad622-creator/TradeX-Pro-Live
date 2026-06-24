const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getPortfolio,
  createPortfolio
} = require("../controllers/portfolioController");

// Create Portfolio
router.post("/", authMiddleware, createPortfolio);

// Get Portfolio
router.get("/", authMiddleware, getPortfolio);

module.exports = router;