
const User = require("../models/User");
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies;
        if (!token) return res.status(401).json({
            success: false,
            message: "Please login"
        });

        const JWT_SECRET = process.env.JWT_SECRET;
        const decodedMsg = await jwt.verify(token, JWT_SECRET);

        const { _id } = decodedMsg;
        const user = await User.findById(_id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        console.log("inside auth middleware", user);

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })

    }

}

module.exports = {
    userAuth,
}