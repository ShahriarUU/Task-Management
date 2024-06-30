import User from "../models/user.model.js";
import asyncErrorHandle from "../utils/asyncError.js";
import customError from "../utils/customError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncErrorHandle(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("bearer", "");

        if (!token) {
            next(new customError("UnAuthorized Request", 401));
        }

        //decoded Token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
        if (!user) {
            const error = new customError("Invalid Access Token", 401);
            next(error);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
});

export default verifyJWT;