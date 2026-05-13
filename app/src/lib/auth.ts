import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function isAdminAuthenticated(req?: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('springscout_admin_session');
  const ADMIN_SECRET = process.env.ADMIN_SECRET ?? '';

  if (!ADMIN_SECRET) {
    return false;
  }

  const headerSecret = req?.headers.get('x-admin-secret');
  const hasValidCookie = sessionCookie?.value === `authenticated:${ADMIN_SECRET}`;
  const hasValidHeader = headerSecret === ADMIN_SECRET;

  return hasValidCookie || hasValidHeader;
}
