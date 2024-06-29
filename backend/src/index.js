import app from './app.js';
import dotenv from 'dotenv';

//config dotenv 
dotenv.config({ path: './.env' });


//listen server
const port = process.env.PORT || 8080;

app.use('/', (req, res) => {

    res.json({
        message: "hello"
    })
})
app.listen(port, () => {
    console.log(`server is runing port ${port}`);
});