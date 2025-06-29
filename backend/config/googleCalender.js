import { google } from 'googleapis';

/**
 * Returns an authenticated google.calendar v3 client for the *linked* user.
 * Throws if the account hasn't connected Google Calendar yet.
 */
export const getCalendarClient = (user) => {
  if (!user.googleRefreshToken) {
    throw new Error('Google Calendar not linked for this account');
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:4000/api/user/auth/google/callback' // same redirect URI
  );

  oauth2.setCredentials({ refresh_token: user.googleRefreshToken });

  // googleapis auto‑refreshes the access token when needed
  return google.calendar({ version: 'v3', auth: oauth2 });
};
