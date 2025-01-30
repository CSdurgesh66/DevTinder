const User = require("../models/User");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");


exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, skills } = req.body;
        // validation
        validateSignUpData(req);

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        const data = req.body;
        console.log(data);

        const user = new User({
            skills,
            firstName,
            lastName,
            email,
            password,
            password: hashedPassword,

        }
        );


        await user.save();
        return res.status(200).json({
            success: true,
            message: "data saved successfully",
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            errror: error.message,
        })
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

        if (presentPassword==true) {
            // create token
            const token = await user.getJWT();
            res.cookie("token", token);

        }else {
            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Login successful",
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