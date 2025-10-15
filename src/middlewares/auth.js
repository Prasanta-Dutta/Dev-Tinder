const { JWT_SECRET } = require("../constants");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const auth = async (req, res, next) => {
    try{
        const cookie = req.cookies;
        
        if(!cookie.userAuthenticationToken){
            return res.send("Token expired");
        }
        else{
            const { _id } = jwt.verify(cookie.userAuthenticationToken, JWT_SECRET);
            const user = await Users.findById(_id);
            req.user = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                mobile: user.mobile
            };
            next();
        }
    }
    catch(err){
        return res.send("Error: " + err.message);
    }
};

module.exports = {
    auth
};