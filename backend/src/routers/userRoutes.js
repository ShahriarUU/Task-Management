import express, { Router } from "express";
import verifyJWT from "../middelwares/authMiddelware.js";

import { userRegisterController } from "../controllers/userController.js";

const userRoute = express.Router();


userRoute.post("/register", userRegisterController);



export default userRoute;