import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require a configured workspace
const PUBLIC_PATHS = [
  '/onboarding',
  '/auth',
  '/api',
  '/_next',
  '/favicon.ico',
];

// Dev bypass — comment out the early return to enforce onboarding in local dev
const IS_DEV = process.env.NODE_ENV === 'development';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Dev bypass — skip onboarding check locally
  if (IS_DEV) {
    return NextResponse.next();
  }

  // Check for CT_WORKSPACE_EMAIL cookie or env var to determine configured state.
  // We can't call Supabase directly in Edge middleware, so we use a lightweight
  // cookie that /api/admin/config sets after a successful save.
  const configured = request.cookies.get('ct_configured')?.value === '1';

  if (!configured && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api routes (handled separately)
     * - _next/static, _next/image, favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};