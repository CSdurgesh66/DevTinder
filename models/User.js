const mongoose = require("mongoose");
const validator = require("validator");


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

module.exports = mongoose.model("User",userSchema);