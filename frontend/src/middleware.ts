import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('mock_aws_session')
  const { pathname } = request.nextUrl
  const isLoginPage = pathname.startsWith('/login')
  const isLandingPage = pathname === '/'

  // The public Route 53 marketing page is always reachable.
  if (isLandingPage) {
    return NextResponse.next()
  }

  if (!authCookie && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (authCookie && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
