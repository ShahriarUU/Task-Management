import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routers/userRoutes.js";
import { globalError } from "./controllers/globleErrorController.js";

const app = express();

// active all  middelwares



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())



//routes

app.use("/api/v1/user", userRoute);


//Invalid  Routes Error handles
app.all("*", (req, res, next) => {
    const error = new customError(
        `can't find ${req.originalUrl} on the Server`,
        404
    );
    next(error);
});

//global error middelware
app.use(globalError);

export default app;


