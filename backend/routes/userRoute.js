import express from "express"
import {loginUser, registerUser,googleAuth,googleCallBack,forgotPassword,resetPassword,} from "../controllers/userController.js"


const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get('/auth/google',googleAuth)
userRouter.get('/auth/google/callback', googleCallBack);
userRouter.post('/forget-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
export default userRouter