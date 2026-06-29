const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Deposit", depositSchema);