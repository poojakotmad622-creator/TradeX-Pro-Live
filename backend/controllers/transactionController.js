const Transaction = require("../models/Transaction");

// Buy Stock
exports.buyStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;

    const transaction = new Transaction({
      user: req.user.id,
      symbol,
      type: "BUY",
      quantity,
      price
    });

    await transaction.save();

    res.status(201).json({
      message: "Stock bought successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Sell Stock
exports.sellStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;

    const transaction = new Transaction({
      user: req.user.id,
      symbol,
      type: "SELL",
      quantity,
      price
    });

    await transaction.save();

    res.status(201).json({
      message: "Stock sold successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Transaction History
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id
    });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};