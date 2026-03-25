const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email address");
            }
        }

    },
    password: {
        type: String,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["Male", "Female", "Other"].includes(value)) {
                throw new Error(" gender is not valid , ");
            }
        }
    },
    photoUrl: {
        type: String,
        default: `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`

    },
    about: {
        type: String,
        default: "This is default about",


    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true,
})

// userSchema.index({ email: 1 }, { unique: true });
userSchema.methods.getJWT = async function () {
    const user = this;
    const payload = {
        _id: user._id,
        name:user.firstName,
    }
    // create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputbyUser) {
    const user = this;
    const hassedPassword = user.password

    try {
        console.log("Comparing passwords...");
        const isPasswordValid = await bcrypt.compare(passwordInputbyUser, hassedPassword);
        console.log("Comparison result:", isPasswordValid);
        return isPasswordValid;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }


}


module.exports = mongoose.model("User", userSchema);