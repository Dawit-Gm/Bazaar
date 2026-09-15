import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/User';
import db from '../../../utils/db';


import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import crypto from 'crypto';


export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account, profile}) {
        // Social login: create or find user in database
      if (account && (account.provider === 'google' || account.provider === 'facebook')) {
        await db.connect();
        
        let dbUser = await User.findOne({ email: profile.email });

        if (!dbUser) {
          // Create new user from OAuth data
          dbUser = new User({
            name: profile.name,
            email: profile.email,
            password: crypto.randomBytes(32).toString('hex'), // random password for OAuth users
            isAdmin: false,
          });
          await dbUser.save();
        }

        token._id = dbUser._id.toString();
        token.isAdmin = dbUser.isAdmin;
        token.name = dbUser.name;
        token.email = dbUser.email;
        
        await db.disconnect();
      }

      // For credentials login, user is passed from authorize()
            if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          };
        }
        throw new Error('Invalid email or password');
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
});
