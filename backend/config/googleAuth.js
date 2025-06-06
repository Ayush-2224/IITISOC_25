import passport from 'passport';
import {Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:4000/api/user/auth/google/callback",
    proxy:true}
, async (accessToken, refreshToken, profile, done) => {
        try {
            if(!profile || !profile.id || !profile.emails || profile.emails.length === 0) {
                return done(new Error("No profile information received from Google"));
            }
            const user= await userModel.findOne({ googleId: profile.id });
          
    
    

            if(!user){
               const randomPassword = Math.random().toString(36).slice(-8);
               const salt = await bcrypt.genSalt(10);
               const hashedPassword = await bcrypt.hash(randomPassword, salt);
              const user=await userModel.create({
                    name: profile.displayName ||profile.emails[0].value.split('@')[0],
                    email: profile.emails[0].value,
                    password: hashedPassword,
                    googleId: profile.id,
                    profilePic: profile.photos?.[0].value || "https://api.dicebear.com/9.x/micah/svg?seed=Christopher"
                });
            }
            return done(null,user);
        }
        catch(error){
             console.error('Google authentication error:', error);
    return done(error, null);
        }
    }
    
))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');;
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
