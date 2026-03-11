import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplified middleware since jose requires edge runtime compatible stuff.
// However, getting session cookie and doing basic check works fine, or we check in layout/page for full validation.
// For now, check if session cookie exists.

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isApi = request.nextUrl.pathname.startsWith('/api');
  const isPublicFile = request.nextUrl.pathname.match(/\.(.*)$/);
  const isRoot = request.nextUrl.pathname === '/';

  if (isPublicFile) return NextResponse.next();

  // Redirect root to dashboard
  if (isRoot) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user tries to go to an auth page while logged in, redirect to dashboard
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is unauthenticated and tries to access protected routes, redirect to login
  if (!session && !isAuthPage && !isApi) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
