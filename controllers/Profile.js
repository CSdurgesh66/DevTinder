const User = require("../models/User");
const {validateEditProfileData} = require("../utils/validation");


exports.getProfile = async(req,res) =>{
    // get profile
        try{
    
            const user = req.user;
            console.log(user);
            // const cookie = req.cookies;
            // console.log("cookie",cookie);
    
            // const {token} = cookie;
    
            // const decodedMsg = await jwt.verify(token,process.env.JWT_SECRET);
            // console.log("decodedMsg",decodedMsg);
    
            // const {_id} = decodedMsg;
            // const data = await User.findById({_id:_id});
            // console.log("Logged In user id" , _id);
    
            res.status(200).json({
                success: true,
                message: "profile fetched successfully",
                // data,
                user,
            })
    
        }catch(error){
            console.error(error);
        }
}

exports.updateProfile = async(req,res) =>{
    try{

        if(!validateEditProfileData(req)){
             throw new Error("Invalid Edit request");
        }


        const user = req.user;
        console.log(user);

        Object.keys(req.body).forEach((key) => user[key]=req.body[key]);

        console.log(user);

        await user.save();

        return res.status(200).json({
            success: true,
            message: `${user.firstName} your profile has been updated successfully`,
        })

    }catch(error){
        console.error(error.message);
    }
}
