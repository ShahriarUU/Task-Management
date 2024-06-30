import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
        validate: [validator.isAlpha, "Name should only contain alphabets"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Invalid email address"],
        unique: true,
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    password: {
        type: String,
        required: [true, "Password  is required"],
    },

    refreshToken: {
        type: String,
    },

    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Task"
        }
    ],

    date: {
        type: Date,
        default: Date.now,
    },

})


//password hashing
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


//compare  password
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

//Generate Access Token 
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};


//Generate Refresh Token

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};


const User = mongoose.model("User", userSchema);

export default User;