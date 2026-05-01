import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
//
// Currently DISABLED for local development.
//
// To re-enable for production:
// 1. Uncomment the block below
// 2. Make sure these are set in .env.local:
//      GOOGLE_CLIENT_ID=...
//      GOOGLE_CLIENT_SECRET=...
//      NEXTAUTH_SECRET=...
//      NEXTAUTH_URL=https://yourdomain.com
// 3. Update ALLOWED_DOMAIN in src/lib/auth.ts
//
// import { getToken } from 'next-auth/jwt';
//
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   if (
//     pathname.startsWith('/api/auth') ||
//     pathname.startsWith('/api/slack/digest') ||
//     pathname.startsWith('/auth/signin') ||
//     pathname.startsWith('/_next') ||
//     pathname === '/favicon.ico'
//   ) {
//     return NextResponse.next();
//   }
//   const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
//   if (!token) {
//     if (pathname.startsWith('/api/')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     const signInUrl = new URL('/auth/signin', request.url);
//     signInUrl.searchParams.set('callbackUrl', request.url);
//     return NextResponse.redirect(signInUrl);
//   }
//   return NextResponse.next();
// }

export async function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
