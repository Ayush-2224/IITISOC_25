import express from "express"
import {loginUser, registerUser,googleAuth,googleCallBack,forgotPassword,resetPassword,logout,getUserProfile} from "../controllers/user.controller.js"
import authUser from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get('/auth/google',googleAuth)
userRouter.get('/logout', logout);
userRouter.get('/auth/google/callback', googleCallBack);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.get('/profile', authUser, getUserProfile);
export default userRouter