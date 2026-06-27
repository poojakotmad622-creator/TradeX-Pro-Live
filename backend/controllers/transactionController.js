const Transaction = require("../models/Transaction");

// BUY STOCK
exports.buyStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      symbol,
      type: "BUY",
      quantity,
      price
    });

    res.status(201).json({
      success: true,
      message: "Stock bought successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// SELL STOCK
exports.sellStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      symbol,
      type: "SELL",
      quantity,
      price
    });

    res.status(201).json({
      success: true,
      message: "Stock sold successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// TRANSACTION HISTORY
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      transactions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};