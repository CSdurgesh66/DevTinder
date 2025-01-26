const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/User");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");


app.use(express.json());
app.use(cookieParser());

// push data
app.post("/signup",async (req, res) => {
    try {
        // console.log(req.body);
        const { firstName, lastName, email, password } = req.body;
        // const data = req.body;

        // validation
        validateSignUpData(req);
        // const {password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const data = req.body;
        

        const user = new User({

        
            firstName,
            lastName,
            email,
            password,
            // data,
            password:hashedPassword,
           
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
            errror:error.message,
        })
    }
});

app.post("/login", async(req,res) =>{
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

        const payload = {
            _id:user._id,
        }
        const JWT_SECRET = process.env.JWT_SECRET;
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
});

// get profile
app.get("/profile",userAuth,async(req,res) =>{
    try{

        const user = req.user;
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
})

// get data 
app.get('/getData', async (req, res) => {
    try {
        const data = await User.find({});
        console.log("data is here:", data);
        return res.status(200).json({
            success: true,
            data: data,
            message: "fetech data successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching data"
        })
    }
})

// delete data 
app.delete("/deleteData", async (req, res) => {
    try {
        const userid = req.body.userId;

        await User.findByIdAndDelete(userid);

        return res.status(200).json({
            success: true,
            message: "data deleted successfully",
        });
    }catch (err) {
    return res.status(500).json({
        success: false,
        message: "Error deleting data"
    });
  }
});

// update data 
app.post("/updateData",async(req,res) =>{
    try{

        // fetch 
        const userid = req.body.userId;
        const {lastName } = req.body;

        const updatedData = await User.findByIdAndUpdate(
            userid,
            {
                $set:{
                    lastName:lastName,
                }
            },
            {new:true},
        );
        
        console.log(updatedData);
        return res.status(200).json({
            success: true,
            message: "data updated successfully",
            updatedData,
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error updating data"
        })
    }
})


dbConnect()
    .then(() => {
        console.log("Database connection established..");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });

    })
    .catch((error) => {
        console.error("database can not connected");
    })



app.get("/", (req, res) => {
    res.send("home, page!");
})
