import mongoose from "mongoose";
import { DatabaseName } from "../constains.js";


const dbConnection = async () => {

    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}${DatabaseName}`);
        console.log(`MongoDB Connetion !! DB Host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED", error);
        process.exit(1);
    }

}

export default dbConnection;