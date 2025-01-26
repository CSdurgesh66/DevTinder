const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:20,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true, // doubt -> not working 
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address");
        }
    }
        
    },
    password:{
        type:String,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value) {
            if(!["male","female","other"].includes(value)){
                throw new Error(" gender is not valid , ");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"This is url of default image",
    },
    about:{
        type:String,
        default:"this is a about of user -> default"
    },
    skills:{
        type:[String],
    }
},{
    timestamps:true,
})

// userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const payload = {
        _id : user._id,
    }
     const token = jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn :"7d"});

     return token;
}

userSchema.methods.validatePassword = async function (passwordInputbyUser) {
    const user = this;
    const hassedPassword = user.password

     const isPasswordValid = await bcrypt.compare(passwordInputbyUser, hassedPassword);

     return isPasswordValid;


}


module.exports = mongoose.model("User",userSchema);