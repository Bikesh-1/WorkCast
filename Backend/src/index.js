import dotenv from "dotenv"
import connectDB from "./db/index.js"
import mongoose from "mongoose"
import {app} from "./app.js"

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed!!", err);
})