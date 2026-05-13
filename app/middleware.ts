import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? '';
const ADMIN_SESSION_COOKIE = 'springscout_admin_session';

/**
 * Admin auth guard.
 * Pattern: /admin/{secret}/**
 *
 * Strategy:
 * 1. If the URL segment doesn't match ADMIN_SECRET → 404
 * 2. If no valid session cookie → redirect to /admin/{secret}/login
 * 3. If on login page and has valid session → redirect to dashboard
 */
function handleAdminRoute(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;

  // Extract secret from path: /admin/{secret}/...
  const adminMatch = pathname.match(/^\/admin\/([^/]+)(\/.*)?$/);
  if (!adminMatch) return null;

  const urlSecret = adminMatch[1];

  // Wrong secret → hard 404
  if (!ADMIN_SECRET || urlSecret !== ADMIN_SECRET) {
    return new NextResponse(null, { status: 404 });
  }

  const loginPath = `/admin/${ADMIN_SECRET}/login`;
  const isLoginPage = pathname === loginPath;
  const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE);
  const isAuthenticated = sessionCookie?.value === `authenticated:${ADMIN_SECRET}`;

  if (isLoginPage && isAuthenticated) {
    // Already logged in — go to dashboard
    return NextResponse.redirect(new URL(`/admin/${ADMIN_SECRET}`, req.url));
  }

  if (!isLoginPage && !isAuthenticated) {
    // Not logged in — go to login
    return NextResponse.redirect(new URL(loginPath, req.url));
  }

  return null; // Allow through
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes bypass i18n middleware
  if (pathname.startsWith('/admin/')) {
    const adminResponse = handleAdminRoute(req);
    if (adminResponse) return adminResponse;
    return NextResponse.next();
  }

  // API routes bypass i18n middleware
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // All other routes go through next-intl middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
