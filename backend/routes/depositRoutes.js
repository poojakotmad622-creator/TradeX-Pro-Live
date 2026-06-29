const express = require("express");
const router = express.Router();

const Deposit = require("../models/Deposit");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

/* ================= USER CREATE DEPOSIT ================= */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const deposit = await Deposit.create({
      userId: req.user.id,
      amount: req.body.amount
    });

    res.json(deposit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADMIN VIEW DEPOSITS ================= */

router.get("/", async (req, res) => {
  try {
    const deposits = await Deposit.find().populate("userId", "name email");

    res.json(deposits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= APPROVE ================= */

router.put("/:id/approve", async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    deposit.status = "Approved";
    await deposit.save();

    await User.findByIdAndUpdate(deposit.userId, {
      $inc: { balance: deposit.amount }
    });

    res.json({ message: "Deposit Approved" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= REJECT ================= */

router.put("/:id/reject", async (req, res) => {
  try {
    await Deposit.findByIdAndUpdate(req.params.id, {
      status: "Rejected"
    });

    res.json({ message: "Deposit Rejected" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;