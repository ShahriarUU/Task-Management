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


export const userLoginController = asyncErrorHandle(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        next(new customError("All fileds are requied", 400));
    }

    const currentUser = await User.findOne({ email });

    if (!currentUser) {
        next(new customError("User are not registed", 400));
    }

    const isPasswordValid = await currentUser.isPasswordCorrect(password);

    if (!isPasswordValid) {
        next(new customError("invalid credentials", 400));
    }

    //genetate accessToken and refresh Token

    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
        currentUser._id
    );

    //update user after generated tokens
    const loggedInUser = await User.findById(currentUser._id).select(
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
                refreshToken: refreshToken,
            },
        });
});



//user logout
export const userLogoutController = asyncErrorHandle(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };


    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            status: "success",
            message: "Logout successfully",
        });
});

export const setNewRefreshTokens = asyncErrorHandle(async (req, res, next) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;


    if (!incomingRefreshToken) {
        const error = new customError("Unauthrized request", 401);
        next(error);
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
        const error = new customError("invalid refresh Token", 401);
        next(error);
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        const error = new customError("refresh token is expired or used", 401);
        next(error);
    }

    const options = {
        httpOnly: true,
        secure: true,
    };
    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
        user._id
    );



    const currentUser = await User.findById(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            status: "success",
            data: {
                user: currentUser,
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
});


export const changeCurrentPassword = asyncErrorHandle(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        next(new customError("Invalid old password", 400));
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        status: "success",
        data: {
            message: "password change successfully",
        },
    });
})


export const getProfile = asyncErrorHandle(async (req, res, next) => {

    res.status(200)
        .json({
            status: "success",
            data: {
                user: req.user,
                message: "Profile Details fetched successfully"
            }
        }
        )
})

export const updateAccountDetails = asyncErrorHandle(async (req, res, next) => {
    const { name, email } = req.body

    const currentUser = await User.findById(req.user?._id);

    if (currentUser) {
        currentUser.name = name || currentUser.name;
        currentUser.email = email || currentUser.email;

        const updatedUser = await currentUser.save();


        res.status(200)
            .json({
                status: "success",
                data: {
                    user: updatedUser,
                    message: "Account details updated successfully"
                }

            })

    }
    else {
        next(new customError("something went wrong,try again"));
    }





});