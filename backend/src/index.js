import app from './app.js';
import dotenv from 'dotenv';
import dbConnection from './db/dbConnecte.js';

//config dotenv 
dotenv.config({ path: './.env' });


//listen server
const port = process.env.PORT || 8080;


dbConnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`server is runing port ${port}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed", error);
    });

