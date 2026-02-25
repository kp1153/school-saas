import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(
    process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/parent/login`
      : 'https://school-saas-seven.vercel.app/parent/login'
  )
  response.cookies.set('parent_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })
  return response
}