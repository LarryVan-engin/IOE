const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        minlength: 6,
        maxlenght: 20,
        unique: true        
    },
    email:{
        type: String,
        require: true,
        minlength: 10,
        maxlenght: 50,
        unique: true        
    },
    password:{
        type: String,
        require: true,
        minlength: 6
    },
    admin:{
        type: Boolean,
        default: false
    },
    phone:{
        type: String,
        require: true,
        length: 10,
        unique: true
    },
    fullname:{
        type: String,
        require: true,
        minlength: 4
    }
}, 
    {timestamps: true}
)

module.exports = mongoose.model("User",userSchema);
