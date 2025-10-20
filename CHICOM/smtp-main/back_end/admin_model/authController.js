const User = require("../user_model/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sendMail}= require("../ultils/mailer");

let refreshTokens = [];

const authController = {
    //REGISTER
    registerUser: async(req, res)=> {
        try{
            const salt = await bcryptjs.genSalt(10);
            const hashed = await bcryptjs.hash(req.body.password, salt);

            //Creat new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                fullname: req.body.fullname,
                phone: req.body.phone,
                status: "pending"
            });

            //Save to DB
            const user = await newUser.save();

            // Optional: thông báo admin
            try {
                await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: `User mới đăng ký chờ duyệt: ${user.username}`,
                html: `<p>Người dùng <b>${user.fullname}</b> (${user.email}) vừa đăng ký. Vui lòng vào admin để duyệt.</p>`
                });
            } catch (err) {
                console.error("Mail notify admin failed:", err);
            }
            
            res.status(201).json({
                message: "Registry successfully !",
                user: {
                    id: user._id,
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email,
                    phone: user.phone,
                    status: user.status
                }
            });
        } catch (err) {
            console.log(err);
            if (err.name == 'ValidationError'){
                //Loi do du lieu nhap vao
                return res.status(400).json({message: 'INvalidation data', errors: err.errors});
            }
            if (err.code === 11000) {
                // Lỗi trùng khóa duy nhất trong MongoDB
                return res.status(400).json({
                message: `Tên đăng nhập hoặc email đã tồn tại. Vui lòng chọn tên khác.`,
                field: Object.keys(err.keyPattern)[0]  // ví dụ 'username' hoặc 'email'
                });
            }
            res.status(500).json({message: "Server error", error: err});
        }
    },
    //==================
    //GENERATE ACCESS TOKEN
    generateAccessToken: (user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
        process.env.SECRETKEY,
        {expiresIn: "15m"}
        );
    },

    //GENERATE REFRESH TOKEN
    generateRefreshToken: (user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        },
         process.env.REFRESHTOKEN,
        {expiresIn: "10d"}
        );
    },

    //===============
    //LOGIN
    loginUser: async(req, res) =>{
        try{
            // cho phep login bang username hoac email
            const {username, email, password } = req.body;
            
            const query = username ? { username } : {email};
            //Neu client submit email nhung backend muon username thi code tren giai quyet van de nay

            const user = await User.findOne(query);
            
            //Kiem tra username/email
            if(!user){
                return res.status(404).json("Wrong username/email");
            }

            //Kiem tra password
            const validPassword = await bcryptjs.compare(
                req.body.password,
                user.password
            );

            if(!validPassword){
                return res.status(404).json("WRONG PASSWORD!");
            }

            // trong loginUser (sau findOne và password check)
            if (user.status !== "active") {
                return res.status(403).json({ message: "Tài khoản chưa được kích hoạt hoặc bị khóa." });
            }


            //Create TOKEN
            //Thiet lap token de bao mat login
            const accessToken = authController.generateAccessToken(user);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000, //15min
                domain: "localhost"
            });

            //Thiet lap refresh token
            const refreshToken = authController.generateRefreshToken(user);
            
            refreshTokens.push(refreshToken);

            //set HTTPOnly cookie name refreshToken
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false, //Khi deploy https:// thi sua lai thanh true
                path: "/",
                sameSite: "strict",
                maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in ms
                domain: "localhost"
            });

            // Thêm dòng này để trích xuất
            const {password: pwd, ...info} = user._doc;
            
            res.status(200).json({
                // Trả về đối tượng user đã tinh gọn
                user: info, 
                accessToken,
                refreshToken // <--- ĐÃ THÊM: Refresh Token
            });
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    },

    //Request REFRESH TOKEN
    requestRefreshToken: async(req, res) =>{
        //Lay refresh token tu user vi access token het han
        const refreshToken = req.cookies.refreshToken;
        console.log("=========REQUEST TOKEN DEBUG============");
        console.log("Receive refresh token from cookie:", refreshToken);

        //res.status(200).json(refreshToken);
        if(!refreshToken) return res.status(401).json("You are not authenticated!");
        
        if(!refreshTokens.includes(refreshToken)){
            return res.status(403).json("Refresh Token is not valid");
        }

        //===================================
        jwt.verify(refreshToken, process.env.REFRESHTOKEN, (err, user) => {
            if(err){
                console.log(err);
                return res.status(403).json("Token invalid");
            }

            //Remove old refreshToken and issue new ones
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            
            //Tao access token moi, refresh token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            
            //push token moi
            refreshTokens.push(newRefreshToken);

            //Set cookie with SAME name 'refreshToken' 
            res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false, //Khi deploy thi sua lai thanh true
                    path: "/",
                    sameSite: "strict",
                    maxAge: 10 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({accessToken: newAccessToken});
        });
    },

    //LOG OUT
    userLogout: async(req, res) =>{
        //Read cookie BEFORE clearing
        const token = req.cookies.refreshToken;
        refreshTokens = refreshTokens.filter((t) => t !== token);
        
        //Clear cookie khi logout
        res.clearCookie("refreshToken", {path: "/"});
        res.status(200).json("LOG OUT SUCCESSFULLY !");
    }
};

//STORE TOKEN
//Co nhieu cach de luu tru token
//1) Luu tru tren local storage nhung se bi error XSS neu user chay script lay token

//2) HTTPONLY Cookies: nguy hiem khi bi tan cong CSRF (trang web gia mao, bat ads virus) -> SAMSITE

//=== Bao mat nhat se dung BFF PATTERN (backend for frontend -> chay backend fake thay the backend real)

//3) REDUX STORE -> save ACCESSTOKEN
//HTTPONLY COOKIES -> save REFRESHTOKEN


module.exports = authController;