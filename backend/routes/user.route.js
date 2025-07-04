import express from "express"
import {loginUser, registerUser,googleAuth,googleCallBack,forgotPassword,resetPassword,logout,getUserProfile,updateUserProfile} from "../controllers/user.controller.js"
import authUser from "../middleware/auth.js"
import passport from "../config/googleAuth.js"
const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar.events'
      ],
      accessType: 'offline',
      prompt: 'consent select_account'
    })
  );
  
userRouter.get('/logout', logout);
userRouter.get('/auth/google/callback', googleCallBack);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateUserProfile);
export default userRouter