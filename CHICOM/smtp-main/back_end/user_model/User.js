// user_model/User.js (thay thế file hiện tại)
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true        
    },
    email:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50,
        unique: true        
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    admin:{
        type: Boolean,
        default: false
    },
    phone:{
        type: String,
        required: true,
        match: /^[0-9]{10}$/,
        unique: true
    },
    fullname:{
        type: String,
        required: true,
        minlength: 4
    },
    status: {
        type: String,
        enum: ["pending", "active", "blocked"],
        default: "pending" // mặc định khi register user -> pending chờ admin accept
    }
}, 
    {timestamps: true}
)

module.exports = mongoose.model("User",userSchema);
