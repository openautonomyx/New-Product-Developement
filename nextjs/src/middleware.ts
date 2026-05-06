import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Multi-tenant middleware - handles tenant isolation
export function middleware(request: Request) {
  const url = new URL(request.url);
  
  // Skip for static files and API health
  if (url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/api/auth') ||
      url.pathname === '/health') {
    return NextResponse.next();
  }

  // Extract tenant from subdomain or path
  const hostname = url.hostname;
  const pathParts = url.pathname.split('/');
  
  // Subdomain: tenant.acme.com or Path: /acme/dashboard
  let tenantId = '';
  
  if (hostname.includes('.') && !hostname.includes('localhost')) {
    tenantId = hostname.split('.')[0];
  } else if (pathParts[1] && pathParts[1] !== 'api') {
    tenantId = pathParts[1];
  }

  // Validate tenant access
  if (tenantId) {
    const tenantHeader = request.headers.get('x-tenant-id');
    
    // If tenant in header doesn't match URL tenant
    if (tenantHeader && tenantHeader !== tenantId) {
      return NextResponse.json(
        { error: 'Tenant mismatch' },
        { status: 403 }
      );
    }
    
    // Add tenant to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-id', tenantId);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};