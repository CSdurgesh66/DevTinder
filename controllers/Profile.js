const User = require("../models/User");
const { validateEditProfileData } = require("../utils/validation");


exports.getProfile = async (req, res) => {
    // get profile
    try {

        const user = req.user;
        console.log("inside getprofile ", user);

        res.status(200).json({
            success: true,
            message: "profile fetched successfully",
            data: user,
        })

    } catch (error) {
        console.error(error);
    }
}

exports.updateProfile = async (req, res) => {
    try {

        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit request");
        }


        const user = req.user;
        console.log("user h ye", user);

        Object.keys(req.body).forEach((key) => user[key] = req.body[key]);

        console.log(user);

        const updatedData  = await user.save();

        return res.status(200).json({
            success: true,
            data:updatedData,
            message: `${user.firstName} your profile has been updated successfully`,
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
