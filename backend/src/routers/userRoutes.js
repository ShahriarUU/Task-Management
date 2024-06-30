import express, { Router } from "express";
import verifyJWT from "../middelwares/authMiddelware.js";

import {
    userRegisterController, userLoginController,
    userLogoutController, setNewRefreshTokens,
    changeCurrentPassword, getProfile, updateAccountDetails
} from "../controllers/userController.js";

const userRoute = express.Router();




userRoute.post("/register", userRegisterController);
userRoute.get("/refresh-token", setNewRefreshTokens);
userRoute.post("/login", userLoginController);

//secured routes
userRoute.get("/logout", verifyJWT, userLogoutController);
userRoute.post("/changePassword", verifyJWT, changeCurrentPassword);
userRoute.get("/getprofile", verifyJWT, getProfile);
userRoute.post("/updateDetails", verifyJWT, updateAccountDetails);


export default userRoute;