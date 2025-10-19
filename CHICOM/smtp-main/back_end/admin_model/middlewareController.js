//Phan nay dung de verify token cho user, gioi han thoi gian su dung token do cho viec dang nhap

const jwt = require("jsonwebtoken");

const middlewareController = {
    //verify token
    verifyToken: (req, res, next)=> {
        //Accept header 'token' custom header
        const tokenHeader = req.headers.authorization || req.headers.token;
        if(tokenHeader){
            //Bearer 'asoasdasdoi' chi lay token sau Bearer
            const accessToken = tokenHeader.split(" ")[1];
            jwt.verify(accessToken, process.env.SECRETKEY, (err, user)=>{
                if(err){
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        }
        else{
            return res.status(401).json("You are not authenticated!");
        }
    },
    //Xac thuc cho admin
    verifyTokenAndAdminAuth: (req, res, next)=>{
        middlewareController.verifyToken(req, res, ()=>{
            if(req.user.id == req.params.id || req.user.admin){
                next();
            }
            else{
                res.status(403).json("You are not allowed to delete other");
            }
        });
    }
};

module.exports = middlewareController;