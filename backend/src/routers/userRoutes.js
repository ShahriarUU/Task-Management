import express, { Router } from "express";
import verifyJWT from "../middelwares/authMiddelware.js";

import { userRegisterController, userLoginController } from "../controllers/userController.js";

const userRoute = express.Router();


userRoute.post("/register", userRegisterController);
userRoute.post("/login", userLoginController);



export default userRoute;