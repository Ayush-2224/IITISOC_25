import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";



// express app
const app =express()

// port from .env
const PORT = 4000;

// connection to database
connectDB()

// middlewares
app.use(express.json())
app.use(cors())


// api endpoints
app.use("/api/user",userRouter);

app.get("/",(req,res)=>{
    res.send("api working")
})



app.listen(PORT,()=>{
    console.log("server started on PORT" + PORT);
})

