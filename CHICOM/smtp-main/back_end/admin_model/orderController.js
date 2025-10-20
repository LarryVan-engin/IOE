// admin_model/orderController.js
const Order = require("../user_model/Order");
const User = require("../user_model/User");
const { sendMail } = require("../ultils/mailer");

// Tạo order (user)
const createOrder = async (req, res) => {
  try {
    // req.user set bởi verifyToken
    const userId = req.user.id;
    const { items } = req.body; // items: [{productId,name,price,quantity}]
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

    const order = new Order({
      user: userId,
      items,
      total,
      status: "created"
    });
    await order.save();

    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// User confirms payment on payment page -> set status waiting_admin_confirm and send mail to admin
const confirmPaymentByUser = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.user._id) !== String(req.user.id)) return res.status(403).json({ message: "Forbidden" });

    order.status = "waiting_admin_confirm";
    await order.save();

    // Gửi email thông báo admin
    try {
      await sendMail({
        to: process.env.ADMIN_EMAIL,
        subject: `Đơn hàng #${order._id} chờ xác nhận`,
        html: `<p>Đơn hàng #${order._id} bởi ${order.user.fullname} đang chờ xác nhận thanh toán. Tổng: ${order.total}.</p>`
      });
    } catch (e) { console.error("Mail send failed:", e); }

    res.status(200).json({ message: "Order waiting for admin confirmation" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin confirm or reject
const adminConfirmOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const action = req.body.action; // "confirm" or "reject"
    const order = await Order.findById(orderId).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (action === "confirm") {
      order.status = "confirmed";
      // generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      order.otp = otp;
      await order.save();

      // send email with OTP to user
      try {
        await sendMail({
          to: order.user.email,
          subject: `Đơn hàng #${order._id} đã được xác nhận - OTP`,
          html: `<p>Đơn hàng #${order._id} đã được xác nhận. Mã OTP của bạn: <b>${otp}</b></p>`
        });
      } catch (e) { console.error("Send mail to user failed:", e); }

      res.status(200).json({ message: "Order confirmed" });

    } else if (action === "reject") {
      order.status = "rejected";
      await order.save();

      // inform user
      try {
        await sendMail({
          to: order.user.email,
          subject: `Đơn hàng #${order._id} bị từ chối`,
          html: `<p>Đơn hàng #${order._id} đã bị từ chối. Vui lòng liên hệ admin.</p>`
        });
      } catch (e) { console.error(e); }

      res.status(200).json({ message: "Order rejected" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: list orders by status
const listOrders = async (req, res) => {
  try {
    const status = req.query.status; // optional
    const query = status ? { status } : {};
    const orders = await Order.find(query).populate("user", "-password");
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  confirmPaymentByUser,
  adminConfirmOrder,
  listOrders
};
