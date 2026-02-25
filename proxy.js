import { NextResponse } from 'next/server'

const publicPaths = ['/', '/login', '/signup']

export function proxy(request) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('session')?.value

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}