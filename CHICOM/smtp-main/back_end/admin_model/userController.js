const User = require("../user_model/User");

const userController = {
    // Lấy tất cả users (chỉ admin)
    getAllUsers: async (req, res) => {
        try {
            const user = await User.find().select("-password"); // loại bỏ password
            res.status(200).json(user);
        } catch (err) {
            console.error("Error in getAllUsers:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Xóa user theo ID (chỉ admin)
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully" });
        } catch (err) {
            console.error("Error in deleteUser:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = userController;
