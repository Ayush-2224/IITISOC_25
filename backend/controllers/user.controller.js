import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"
import passport from '../config/googleAuth.js';

import transporter from '../config/nodeMailer.js'
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};



// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't Exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token,userId:user._id });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




// Route for user registration
const registerUser = async (req, res) => {
  
  try {
    const { name, email, password, profilePic } = req.body;

    // checking user if already present or not
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "please Enter Valid Email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "please enter strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePic ||"https://api.dicebear.com/9.x/micah/svg?seed=Christopher"
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const googleAuth = passport.authenticate('google', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar.events'   
    ],
    accessType: 'offline',        
    prompt: 'consent select_account' 
  });

const ClientURL=process.env.BASE_URL

const googleCallBack=[
  passport.authenticate('google',{
    failureRedirect: `${ClientURL}/login`,
    session: false
  }),
  async(req,res)=>{
   try{ if(!req.user || !req.user._id){
      throw new Error("User authentication failed");
    }
    const token = createToken(req.user._id);
    res.redirect(`http://localhost:5173/auth?token=${token}&userId=${req.user._id}`);

  } catch(error){
      console.error('Google authentication error:', error);
      res.redirect(`${ClientURL}/signup`);
    }
  }
]

const forgotPassword = async (req, res) => {
  console.log('forgotPassword called');
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const JWT_SECRET = process.env.JWT_SECRET_FORGETPASSWORD;
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
    const resetURL = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password</p>`,
    });

    res.status(200).json({ message: 'Reset email sent successfully' });
  } catch (error) {
    console.error('forgotPassword error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  console.log('resetPassword called');
  const { token, password } = req.body;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET_FORGETPASSWORD);
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "please enter strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logout completed successfully' });
  } catch (error) {
    console.error('logout error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get user profile for authentication verification
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('getUserProfile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, profilePic } = req.body;

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Update user fields - removed email editing
    if (name) user.name = name;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    const updatedUser = await userModel.findById(userId).select('-password');
    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, googleAuth, googleCallBack, forgotPassword, resetPassword, logout, getUserProfile, updateUserProfile };