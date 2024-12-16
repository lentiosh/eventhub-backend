import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '../db/index.js';
import { usersTable } from '../db/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar'
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails[0].value;
        const name = profile.displayName;
       
        const users = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .limit(1);

        let user;
        if (users.length === 0) {
          
          const hashedPassword = await bcrypt.hash('google_oauth_password', 10);
          const [newUser] = await db
            .insert(usersTable)
            .values({
              name,
              email,
              password: hashedPassword,
              is_staff: false,
              google_access_token: accessToken,
              google_refresh_token: refreshToken || null,
            })
            .returning({
              id: usersTable.id,
              email: usersTable.email,
              is_staff: usersTable.is_staff,
              google_access_token: usersTable.google_access_token,
              google_refresh_token: usersTable.google_refresh_token,
              name: usersTable.name,
            });

          
          user = newUser;
        } else {
        
          const [updatedUser] = await db
            .update(usersTable)
            .set({
              google_access_token: accessToken,
              ...(refreshToken ? { google_refresh_token: refreshToken } : {}),
            })
            .where(eq(usersTable.email, email))
            .returning({
              id: usersTable.id,
              email: usersTable.email,
              is_staff: usersTable.is_staff,
              google_access_token: usersTable.google_access_token,
              google_refresh_token: usersTable.google_refresh_token,
              name: usersTable.name,
            });

          
          user = updatedUser;
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, is_staff: user.is_staff, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        user.token = token;
        
        done(null, user);
      } catch (error) {
        
        done(error, null);
      }
    }
  )
);

GoogleStrategy.prototype.authorizationParams = function(options) {
  return {
    access_type: 'offline',
    prompt: 'consent'
  };
};

export default passport;
