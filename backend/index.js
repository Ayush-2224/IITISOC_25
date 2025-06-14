import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import passport from './config/googleAuth.js';
import session from "express-session";



// port from .env
const PORT = 4000;

// connection to database
connectDB()

// middlewares
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());


// api endpoints
app.use("/api/user",userRouter);

app.get("/",(req,res)=>{
    res.send("api working")
})
app.use("/api/events",eventsRoute);
// Error handling middleware
app.use((error, req, res, next) => {
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        console.log(error);
        return res.status(400).json({ error: 'Unexpected file upload.' });
    }
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknown error occurred"})
});

server.listen(PORT,()=>{
    console.log("server started on PORT" + PORT);
})

