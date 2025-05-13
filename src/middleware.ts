import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For Vercel deployment, we need to handle the case where cookies might not be available
  try {
    const token = request.cookies.get('token')?.value || '';
    const path = request.nextUrl.pathname;

    // Public paths that don't require authentication
    const publicPaths = [
      '/login',
      '/register',
      '/welcome',
      '/',
      '/pose-detection',
      '/enhanced-home',
      '/openpose-analyzer',
      '/pose-analysis',
      '/pose-analyzer',
      '/dashboard',
      '/video-library',
      '/exercise-library',
      '/profile',
      '/settings',
      '/ui-components',
      '/404',
      '/_error'
    ];

    // Check if the path is a public path
    const isPublicPath = publicPaths.some(publicPath =>
      path === publicPath ||
      path.startsWith('/api/') ||
      path.startsWith('/_next/') ||
      path.includes('.') // Static files
    );

    // If no token and trying to access protected route, redirect to login
    if (!token && !isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If token exists and trying to access login/register, redirect to dashboard
    if (token && (path === '/login' || path === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Handle 404 and error pages
    if (path === '/404' || path === '/_error' || path.includes('DEPLOYMENT_NOT_FOUND')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of any error, just continue to the page
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
