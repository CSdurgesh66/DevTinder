const User = require("../models/User");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");


exports.signUp = async (req, res) => {
    // push data
    try {
        // console.log(req.body);
        const { firstName, lastName, email, password, skills } = req.body;
        // validation
        validateSignUpData(req);
        // const {password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        const data = req.body;
        console.log(data);

        const user = new User({
            // data,
            skills,
            firstName,
            lastName,
            email,
            password,
            // data,
            password: hashedPassword,

        }
        );


        await user.save();
        return res.status(200).json({
            success: true,
            message: "data saved successfully",
        })
    } catch (error) {
        // console.log(error);
        console.error(error);
        return res.status(500).json({
            success: false,
            // message: "Error saving data",
            errror: error.message,
        })
    }
}


exports.login = async(req,res) =>{
        try{
    
            const { email,password } = req.body;
            
            if(!email){
               return res.status(400).json({
                success:false,
                message:"Email is required"
               });
            }
            
            const user = await User.findOne({email});
            
            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"Invalid email or password"
                });
            }
    
            console.log("req ki body",password);
            console.log("database se",user.password);
    
            const presentPassword = user.validatePassword(password);
    
            // const presentPassword = await bcrypt.compare(password, user.password);
            console.log("password match",presentPassword);
    
            // const payload = {
            //     _id:user._id,
            // }
            // const JWT_SECRET = process.env.JWT_SECRET;
            if(presentPassword){
    
                // create token
                const token = await user.getJWT();
                // const token = jwt.sign(payload,JWT_SECRET);
                console.log(token);
    
                res.cookie("token",token);
                
            }else {
                throw new Error("Invalid password");
            }
    
            return res.status(200).json({
                success: true,
                message: "Login successful",
            });
    
        }catch(error){
            console.error(error);
            return res.status(400).json({
                success: false,
                message: "user not login successfully",
            })
        }
}


exports.logOut = async(req,res) =>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    }).json({
        success:true,
        message:"logout successfully",
    });
}