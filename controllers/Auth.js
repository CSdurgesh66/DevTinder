const User = require("../models/User");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");


exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, skills } = req.body;
        // validation
        validateSignUpData(req);

        const hashedPassword = await bcrypt.hash(password, 10);

        const data = req.body;
        console.log("req body data", data);

        const user = new User({
            skills,
            firstName,
            lastName,
            email,
            password: hashedPassword,

        }
        );


        const savedUser = await user.save();
        // create token 
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });
        return res.status(200).json({
            success: true,
            data: savedUser,
            message: "user signup successfully",
        })
    } catch (err) {
        console.log(err);
        if (err.errors) {
            const message = Object.values(err.errors)[0].message;
            return res.status(400).json({
                success: false,
                message,
            });
        }

        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}


exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            });
        }

        console.log("req body", password);
        console.log("from database ", user.password);

        const presentPassword = await user.validatePassword(password);

        if (presentPassword == true) {
            // create token
            const token = await user.getJWT();
            res.cookie("token", token);

        } else {
            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
            message: "Login successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: "user not login successfully",
        })
    }
}


exports.logOut = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        }).json({
            success: true,
            message: "logout successfully",
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "logout failed",
        })
    }
}