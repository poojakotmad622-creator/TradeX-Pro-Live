console.log("🚀 FINTECH SERVER STARTED");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");

const User = require("./models/User");
const Deposit = require("./models/Deposit");
const Withdrawal = require("./models/Withdrawal");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= JWT ADMIN VERIFY ================= */

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.json({
    status: "Server Running 🚀",
    mongo: process.env.MONGO_URI ? "CONNECTED" : "MISSING",
    jwt: process.env.JWT_SECRET ? "READY" : "MISSING"
  });
});

/* ================= USERS SYSTEM ================= */

app.get("/api/users", verifyToken, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/api/users", verifyToken, async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.delete("/api/users/:id", verifyToken, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= WALLET SYSTEM ================= */

app.get("/api/wallets", verifyToken, async (req, res) => {
  const users = await User.find();

  const wallets = users.map(u => ({
    id: u._id,
    name: u.name,
    balance: u.balance || 0
  }));

  res.json(wallets);
});

app.put("/api/wallet/:id", verifyToken, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    balance: req.body.balance
  });

  res.json({ success: true });
});

/* ================= DEPOSIT SYSTEM ================= */

app.get("/api/deposits", verifyToken, async (req, res) => {
  const data = await Deposit.find();
  res.json(data);
});

app.put("/api/deposit/:id/approve", verifyToken, async (req, res) => {
  const deposit = await Deposit.findById(req.params.id);

  if (!deposit) return res.status(404).json({ message: "Not found" });

  deposit.status = "approved";
  await deposit.save();

  await User.findByIdAndUpdate(deposit.userId, {
    $inc: { balance: deposit.amount }
  });

  res.json({ success: true });
});

app.put("/api/deposit/:id/reject", verifyToken, async (req, res) => {
  await Deposit.findByIdAndUpdate(req.params.id, {
    status: "rejected"
  });

  res.json({ success: true });
});

/* ================= WITHDRAW SYSTEM ================= */

app.get("/api/withdrawals", verifyToken, async (req, res) => {
  const data = await Withdrawal.find();
  res.json(data);
});

app.put("/api/withdraw/:id/approve", verifyToken, async (req, res) => {
  const w = await Withdrawal.findById(req.params.id);

  if (!w) return res.status(404).json({ message: "Not found" });

  w.status = "approved";
  await w.save();

  await User.findByIdAndUpdate(w.userId, {
    $inc: { balance: -w.amount }
  });

  res.json({ success: true });
});

app.put("/api/withdraw/:id/reject", verifyToken, async (req, res) => {
  await Withdrawal.findByIdAndUpdate(req.params.id, {
    status: "rejected"
  });

  res.json({ success: true });
});

/* ================= DASHBOARD STATS ================= */

app.get("/api/admin/stats", verifyToken, async (req, res) => {
  const users = await User.countDocuments();

  const totalBalance = await User.aggregate([
    { $group: { _id: null, total: { $sum: "$balance" } } }
  ]);

  const deposits = await Deposit.countDocuments();
  const withdrawals = await Withdrawal.countDocuments();

  res.json({
    users,
    deposits,
    withdrawals,
    totalBalance: totalBalance[0]?.total || 0
  });
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});