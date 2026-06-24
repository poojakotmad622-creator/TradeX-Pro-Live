const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();
console.log("MONGO_URI =", process.env.MONGO_URI);

// MongoDB Connect
// connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/portfolio", portfolioRoutes);

app.use("/api/transactions", transactionRoutes);

// Home Route
// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Backend Running",
    mongo: process.env.MONGO_URI ? "FOUND" : "MISSING",
    jwt: process.env.JWT_SECRET ? "FOUND" : "MISSING"
  });
});

// Start Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});