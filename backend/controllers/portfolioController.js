const Portfolio = require("../models/Portfolio");

// Get Portfolio
exports.getPortfolio = async (req, res) => {
  try {

    const portfolio = await Portfolio.findOne({
      user: req.user.id
    });

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found"
      });
    }

    res.status(200).json(portfolio);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// Create Portfolio
exports.createPortfolio = async (req, res) => {

  try {

    let portfolio = await Portfolio.findOne({
      user: req.user.id
    });

    if (portfolio) {
      return res.status(400).json({
        message: "Portfolio already exists"
      });
    }

    portfolio = new Portfolio({
      user: req.user.id
    });

    await portfolio.save();

    res.status(201).json({
      message: "Portfolio created successfully",
      portfolio
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};