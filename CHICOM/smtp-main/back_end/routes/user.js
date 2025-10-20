// routes/user.js
const middlewareController = require("../admin_model/middlewareController");
const userController = require("../admin_model/userController");
const User = require("../user_model/User");

const router = require("express").Router();

// GET current user (me)
router.get("/", middlewareController.verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN: get all users
router.get("/all", middlewareController.verifyTokenAndAdminAuth, userController.getAllUsers);

// ADMIN: accept user
router.post("/accept/:id", middlewareController.verifyTokenAndAdminAuth, userController.acceptUser);

// ADMIN: reject user
router.post("/reject/:id", middlewareController.verifyTokenAndAdminAuth, userController.rejectUser);

// DELETE user (admin or self)
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);

module.exports = router;
