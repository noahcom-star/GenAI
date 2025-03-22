import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const organizerEmail = request.cookies.get('organizer_email');
  const participantEmail = request.cookies.get('participant_email');
  const path = request.nextUrl.pathname;

  // Organizer routes protection
  if (path.startsWith('/organizer') && path !== '/organizer/login' && path !== '/organizer/signup') {
    if (!organizerEmail) {
      return NextResponse.redirect(new URL('/organizer/login', request.url));
    }
  }

  // Participant routes protection
  if ((path === '/participant' || path === '/matches') && !participantEmail) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Prevent organizers from accessing participant routes
  if ((path === '/participant' || path === '/matches') && organizerEmail) {
    return NextResponse.redirect(new URL('/organizer/dashboard', request.url));
  }

  // Prevent participants from accessing organizer routes
  if (path.startsWith('/organizer') && participantEmail) {
    return NextResponse.redirect(new URL('/participant', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/organizer/:path*',
    '/participant',
    '/matches'
  ],
}; 