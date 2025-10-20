const User = require("../user_model/User");
const {sendMail} = require("../ultils/mailer");

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
    },

    //accept user
    acceptUser: async (req, res) => {
        try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "User not found" });
        user.status = "active";
        await user.save();

        // gửi email thông báo user được active
        try {
            await sendMail({
            to: user.email,
            subject: "Tài khoản của bạn đã được kích hoạt",
            html: `<p>Xin chào ${user.fullname},</p>
                    <p>Tài khoản của bạn đã được admin chấp thuận. Bạn có thể đăng nhập và sử dụng dịch vụ.</p>`
            });
        } catch (err) {
            console.error("Send mail to user failed:", err);
        }

        res.status(200).json({ message: "User activated" });

        } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        }
    },


    rejectUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if(!user) return res.status(404).json({ message: "User not found" });
            user.status = "blocked"; // hoặc xóa nếu bạn muốn
            await user.save();

            // gửi email thông báo từ chối
            try {
                await sendMail({
                to: user.email,
                subject: "Tài khoản của bạn không được chấp nhận",
                html: `<p>Xin chào ${user.fullname},</p>
                        <p>Rất tiếc, tài khoản của bạn không được chấp thuận. Vui lòng liên hệ admin.</p>`
                });
            } catch (e) { console.error(e); }

            res.status(200).json({ message: "User rejected" });
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = userController;
