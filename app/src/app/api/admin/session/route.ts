import { type NextRequest, NextResponse } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';
const COOKIE_NAME = 'springscout_admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  try {
    const { password, secret } = await req.json();

    // Validate secret and password
    if (
      !ADMIN_SECRET ||
      !ADMIN_PASSWORD ||
      secret !== ADMIN_SECRET ||
      password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set session cookie
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set(COOKIE_NAME, `authenticated:${ADMIN_SECRET}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Logout - clear session cookie
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
