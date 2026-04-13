import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware — Google OAuth gate.
 *
 * Protects every route except:
 *   • /api/auth/*       — NextAuth's own endpoints
 *   • /api/slack/digest — cron-triggered, uses its own DIGEST_SECRET_KEY
 *   • /auth/signin      — the sign-in page itself
 *   • /_next, /favicon   — static assets
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths — skip auth check
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/slack/digest') ||
    pathname.startsWith('/auth/signin') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // API routes → 401 JSON; pages → redirect to sign-in
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
