import { NextRequest, NextResponse } from 'next/server';
import type { Role } from '@truewell/types';
import { canAccess, homeFor } from '@/lib/rbac';

const PUBLIC = ['/', '/login', '/register', '/forgot-password', '/api/auth/login', '/api/auth/register', '/api/health'];

function roleFromCookie(token: string | undefined): Role | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) return null;
    return payload.role as Role;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.includes(pathname)) return NextResponse.next();

  const role = roleFromCookie(req.cookies.get(process.env.SESSION_COOKIE_NAME ?? 'tw_session')?.value);
  if (!role) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: { code: 'unauthenticated', message: 'Sign in to continue' } }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  if (!pathname.startsWith('/api/') && !canAccess(pathname, role)) {
    return NextResponse.redirect(new URL(homeFor(role), req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
