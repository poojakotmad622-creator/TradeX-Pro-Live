const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllUsers
} = require("../controllers/adminController");

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

module.exports = router;