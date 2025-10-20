// routes/order.js
const router = require("express").Router();
const middlewareController = require("../admin_model/middlewareController");
const orderController = require("../admin_model/orderController");

// Tạo order (user)
router.post("/", middlewareController.verifyToken, orderController.createOrder);

// User bấm "Xác nhận đã thanh toán" trên payment page
router.post("/:id/confirm-payment", middlewareController.verifyToken, orderController.confirmPaymentByUser);

// Admin list orders
router.get("/", middlewareController.verifyTokenAndAdminAuth, orderController.listOrders);

// Admin confirm/reject
router.post("/:id/admin-action", middlewareController.verifyTokenAndAdminAuth, orderController.adminConfirmOrder);

module.exports = router;
