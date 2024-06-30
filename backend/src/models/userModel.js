import mongoose from "mongoose";
import validator from "validator";

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

    date: {
        type: Date,
        default: Date.now,
    },

})


const User = mongoose.model("User", userSchema);

export default User;