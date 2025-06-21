import express from "express"
import {loginUser, registerUser,googleAuth,googleCallBack,forgotPassword,resetPassword,logout} from "../controllers/user.controller.js"


const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get('/auth/google',googleAuth)
userRouter.get('/logout', logout);
userRouter.get('/auth/google/callback', googleCallBack);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
export default userRouter