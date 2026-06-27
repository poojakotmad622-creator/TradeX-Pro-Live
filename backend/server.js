console.log("🚀 FINTECH SERVER STARTED");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");

const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= JWT VERIFY ================= */

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ================= USERS ================= */

app.get("/api/users", verifyToken, async (req, res) => {
  res.json(await User.find());
});

app.post("/api/users", verifyToken, async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.delete("/api/users/:id", verifyToken, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= WALLET ================= */

app.get("/api/wallets", verifyToken, async (req, res) => {
  const users = await User.find();

  res.json(users.map(u => ({
    id: u._id,
    name: u.name,
    balance: u.balance || 0
  })));
});

app.put("/api/wallet/:id", verifyToken, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    balance: req.body.balance
  });

  res.json({ success: true });
});


/* ================= DASHBOARD STATS ================= */

app.get("/api/admin/stats", verifyToken, async (req, res) => {
  const users = await User.countDocuments();

  const totalBalance = await User.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$balance" }
      }
    }
  ]);

  res.json({
    users,
    totalBalance: totalBalance[0]?.total || 0
  });
});
/* ================= HOME ROUTE ================= */

app.get("/", (req, res) => {
  res.json({
    status: "Server Running 🚀",
    message: "TradeX Pro Backend is Live",
    mongo: process.env.MONGO_URI ? "CONNECTED" : "MISSING",
    jwt: process.env.JWT_SECRET ? "READY" : "MISSING"
  });
});
/* ================= SERVER ================= */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON", PORT);
});