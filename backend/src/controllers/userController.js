import User from "../models/userModel.js";
import asyncErrorHandle from "../utils/asyncError.js";
import customError from "../utils/customError.js";
import jwt from 'jsonwebtoken';

// generate Access And RefereshToken

const generateAccessAndRefereshToken = async (userId) => {
    try {
        const currentUser = await User.findById({ _id: userId });
        const accessToken = await currentUser.generateAccessToken();
        const refreshToken = await currentUser.generateRefreshToken();


        currentUser.refreshToken = refreshToken;

        const newuser = await currentUser.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(
            "something went wrong while generate access token and refresh token"
        );
    }
};


//register controller
export const userRegisterController = asyncErrorHandle(
    async (req, res, next) => {

        //destructure req.boy
        const { name, email, password } = req.body;


        //save database
        const newUser = await User.create({
            name,
            email,
            password
        });


        const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
            newUser._id
        );

        //update user after generated tokens
        const loggedInUser = await User.findById(newUser._id).select(
            "-password -refreshToken"
        );




        //cookies options
        const options = {
            httpOnly: true,
            secure: true,
        };

        //response


        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                status: "success",
                data: {
                    user: loggedInUser,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            })

    }
);






