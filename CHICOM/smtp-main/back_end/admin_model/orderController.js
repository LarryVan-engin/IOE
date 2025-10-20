const Order = require("../user_model/Order");
const User = require("../user_model/User");
const { sendMail } = require("../ultils/mailer");


//Tao don hang
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;
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

//Xac nhan thanh toan boi user
const confirmPaymentByUser = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.user._id) !== String(req.user.id))
      return res.status(403).json({ message: "Forbidden" });

    order.status = "waiting_admin_confirm";
    await order.save();

    try {
      await sendMail({
        to: process.env.ADMIN_EMAIL,
        subject: `Đơn hàng #${order._id} chờ xác nhận`,
        html: `<p>Đơn hàng #${order._id} bởi ${order.user.fullname} đang chờ xác nhận thanh toán. Tổng: ${order.total}.</p>`
      });
    } catch (e) {
      console.error("Mail send failed:", e);
    }

    res.status(200).json({ message: "Order waiting for admin confirmation" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//Xac nhan don hang boi admin
const adminConfirmOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const action = req.body.action;
    const order = await Order.findById(orderId).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (action === "confirm") {
      order.status = "confirmed";
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      order.otp = otp;
      await order.save();

      try {
        await sendMail({
          to: order.user.email,
          subject: `Đơn hàng #${order._id} đã được xác nhận - OTP`,
          html: `<p>Đơn hàng #${order._id} đã được xác nhận. Mã OTP của bạn: <b>${otp}</b></p>`
        });
      } catch (e) {
        console.error("Send mail to user failed:", e);
      }

      res.status(200).json({ message: "Order confirmed" });

    } else if (action === "reject") {
      order.status = "rejected";
      await order.save();

      try {
        await sendMail({
          to: order.user.email,
          subject: `Đơn hàng #${order._id} bị từ chối`,
          html: `<p>Đơn hàng #${order._id} đã bị từ chối. Vui lòng liên hệ admin.</p>`
        });
      } catch (e) {
        console.error(e);
      }

      res.status(200).json({ message: "Order rejected" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Lấy danh sách đơn của user hiện tại
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Danh sach don hang
const listOrders = async (req, res) => {
  try {
    const status = req.query.status;
    const query = status ? { status } : {};
    const orders = await Order.find(query).populate("user", "-password");
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  confirmPaymentByUser,
  adminConfirmOrder,
  listOrders,
  getUserOrders
};
