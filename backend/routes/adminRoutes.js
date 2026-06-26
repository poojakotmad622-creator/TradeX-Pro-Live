const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboard,
  getUsers,
  createUser,
  getMyTeam
} = require("../controllers/adminController");

// Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboard
);

// All Users
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getUsers
);

// Create User
router.post(
  "/create-user",
  authMiddleware,
  adminMiddleware,
  createUser
);

// My Team
router.get(
  "/my-team",
  authMiddleware,
  adminMiddleware,
  getMyTeam
);

module.exports = router;