import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

// active all  middelwares



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: "2000kb", extended: true }));
app.use(express.static("public"));




export default app;


