const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/User");

app.use(express.json());

// push data
app.post("/signup", (req, res) => {
    try {
        console.log(req.body);
        const { firstName, lastName, email, password } = req.body;

        const user = new User({
            firstName,
            lastName,
            email,
            password,
        });

        user.save();
        return res.status(200).json({
            success: true,
            message: "data saved successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error saving data",
        })
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
