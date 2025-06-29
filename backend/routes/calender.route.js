import { Router } from "express";
import passport from '../config/googleAuth.js';
import { verifyToken } from "../middleware/auth.js";

const router = Router();
const ClientURL = process.env.CLIENT_URL || 'http://localhost:3000';

router.get(
    '/auth/google/link',
    verifyToken,                               // attaches req.user
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

  router.get(
    '/auth/google/link/callback',
    verifyToken,
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${ClientURL}/settings`
    }),
    (req, res) => {
      res.redirect(`${ClientURL}/settings?linkedGoogle=1`);
    }
  );

export default router;