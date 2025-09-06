import dotenv from "dotenv"
import connectDB from "./db/index.js"
import mongoose from "mongoose"
import { app } from "./app.js"
import cors from "cors"

dotenv.config();

const PORT = process.env.PORT || 3000;



connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running at port : ${PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed!!", err);
})