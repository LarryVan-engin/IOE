// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ["created", "waiting_admin_confirm", "confirmed", "rejected"],
    default: "created"
  },
  otp: { type: String, default: null }, // OTP được gửi cho user khi admin xác nhận
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
