const middlewareController = require("../admin_model/middlewareController");
const userController = require("../admin_model/userController");

const router = require("express").Router();

//GET ALL USER
router.get("/", middlewareController.verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {password:pwd, ...info} = user._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});
  

//DELETE USERS
//v1/user/'id:...'
router.delete("/:id",middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);


module.exports = router;