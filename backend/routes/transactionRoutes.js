const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  buyStock,
  sellStock,
  getTransactions
} = require("../controllers/transactionController");

// Buy Stock
router.post("/buy", authMiddleware, buyStock);

// Sell Stock
router.post("/sell", authMiddleware, sellStock);

// Transaction History
router.get("/", authMiddleware, getTransactions);

module.exports = router;