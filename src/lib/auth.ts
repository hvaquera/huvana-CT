import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

/**
 * AUTH CONFIGURATION
 *
 * To enable Google OAuth for a new company:
 * 1. Go to console.cloud.google.com
 * 2. Create a new project → Enable Google OAuth
 * 3. Add authorized redirect URI: https://yourdomain.com/api/auth/callback/google
 * 4. Copy Client ID and Secret into .env.local:
 *      GOOGLE_CLIENT_ID=...
 *      GOOGLE_CLIENT_SECRET=...
 *      NEXTAUTH_SECRET=any-random-string
 *      NEXTAUTH_URL=https://yourdomain.com
 * 5. Change ALLOWED_DOMAIN below to the new company's email domain
 * 6. Re-enable middleware.ts (remove the dev bypass comment)
 */

// ← CHANGE THIS to the company's email domain (e.g. 'newcompany.com')
const ALLOWED_DOMAIN = 'verybigthings.com';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email ?? '';
      return email.endsWith(`@${ALLOWED_DOMAIN}`);
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
