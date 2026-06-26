const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==============================
// Dashboard Stats
// ==============================
exports.getDashboard = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const myTeam = await User.countDocuments({
      createdBy: req.user.id
    });

    res.status(200).json({
      totalUsers,
      myTeam
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// ==============================
// Get All Users
// ==============================
exports.getUsers = async (req, res) => {

  try {

    const users = await User.find()
      .select("-password")
      .populate("createdBy", "name email");

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// ==============================
// Create User
// ==============================
exports.createUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({

      name,
      email,
      password: hashedPassword,

      role: "user",

      createdBy: req.user.id

    });

    res.status(201).json({

      message: "User created successfully",

      user

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// ==============================
// My Team
// ==============================
exports.getMyTeam = async (req, res) => {

  try {

    const team = await User.find({

      createdBy: req.user.id

    }).select("-password");

    res.status(200).json(team);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};