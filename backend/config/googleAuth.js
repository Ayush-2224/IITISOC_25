import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js';

/* ------------------------------------------------------------------
   GOOGLE STRATEGY
   – Works in two modes:
     (a) LOGIN  – user arrives not signed‑in → we log them in / create account
     (b) LINK   – user is already authenticated locally (req.user) → we attach Google
------------------------------------------------------------------ */
passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  'http://localhost:4000/api/user/auth/google/callback',
      proxy: true,
      passReqToCallback: true                     // << makes `req` available below
    },

    /* eslint-disable camelcase */
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (!profile?.id || !profile.emails?.length) {
          return done(new Error('No profile information received from Google'));
        }

        /* ---------- 1. LINK FLOW (user already logged‑in) ---------- */
        if (req.user) {
          const linkedUser = await userModel
            .findById(req.user._id)
            .select('+googleRefreshToken');

          linkedUser.googleId = profile.id;
          if (refreshToken) linkedUser.googleRefreshToken = refreshToken; // first consent only
          await linkedUser.save();
          return done(null, linkedUser);
        }

        /* ---------- 2. LOGIN FLOW (new or returning Google user) --- */
        let user = await userModel
          .findOne({ googleId: profile.id })
          .select('+googleRefreshToken');

        // If no match on googleId, try existing e‑mail to merge accounts
        if (!user) {
          user = await userModel.findOne({ email: profile.emails[0].value });
        }

        // (2a) First‑time Google login → create local user
        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          user = await userModel.create({
            name:  profile.displayName ?? profile.emails[0].value.split('@')[0],
            email: profile.emails[0].value,
            password: hashedPassword,
            googleId: profile.id,
            profilePic:
              profile.photos?.[0].value ??
              'https://api.dicebear.com/9.x/micah/svg?seed=Christopher',
            googleRefreshToken: refreshToken ?? undefined
          });
        }
        // (2b) Returning Google user
        else {
          if (refreshToken) user.googleRefreshToken = refreshToken;      // only present 1st time
          if (!user.googleId) user.googleId = profile.id;                // merge if needed
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error('Google authentication error:', err);
        return done(err);
      }
    }
    /* eslint-enable camelcase */
  )
);

/* ------------------------------------------------------------------
   PASSPORT SERIALISATION (for session-based flows — keeps JWT clean)
------------------------------------------------------------------ */
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id).select('-password');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
