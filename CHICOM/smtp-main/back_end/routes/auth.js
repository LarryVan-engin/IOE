const authController = require("../admin_model/authController");
const middlewareController = require("../admin_model/middlewareController");

const router = require("express").Router();

//REGISTER
router.post("/register", authController.registerUser);

//LOGIN
router.post("/login", authController.loginUser);

//REFRESH
router.post("/refresh", authController.requestRefreshToken);

//LOGOUT
router.post("/logout", middlewareController.verifyToken,authController.userLogout);

module.exports =router;     