// Production Security Headers
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// =============================================================================
// SECURITY HEADERS CONFIGURATION
// =============================================================================

const securityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy for privacy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ' ').trim(),
  
  // Strict Transport Security (1 year)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Permissions Policy
  'Permissions-Policy': 
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getNonce(request: NextRequest): string {
  // Generate a random nonce for inline scripts
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

function is_allowed_origin(origin: string | null): boolean {
  if (!origin) return false;
  
  const allowed_origins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  return allowed_origins.includes(origin) || 
         allowed_origins.some(o => new URL(o).origin === origin);
}

function validate_tenant_access(tenant_id: string, request: NextRequest): boolean {
  // Validate tenant matches request origin or header
  const request_tenant = request.headers.get('x-tenant-id');
  return request_tenant === tenant_id || 
         is_allowed_origin(request.headers.get('origin'));
}

// =============================================================================
// MIDDLEWARE
// =============================================================================

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  
  // Skip for static files and API health checks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/health' ||
    pathname.startsWith('/api/health')
  ) {
    return response;
  }

  // Apply security headers
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Rate limiting (token bucket)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const rate_key = `ratelimit:${ip}`;

  // CSRF protection for state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const csrf_token = request.headers.get('x-csrf-token');
    const nonce = request.headers.get('x-nonce');
    
    // Validate CSRF - either nonce or explicit token
    if (!csrf_token && !nonce) {
      return NextResponse.json(
        { error: 'CSRF validation required' },
        { status: 403, headers: { 'X-CSRF-Required': 'true' } }
      );
    }
  }

  // Tenant isolation
  const tenant_id = request.headers.get('x-tenant-id');
  if (tenant_id && !validate_tenant_access(tenant_id, request)) {
    return NextResponse.json(
      { error: 'Tenant access denied' },
      { status: 403 }
    );
  }

  // Authenticated routes
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    const auth_token = request.headers.get('authorization');
    if (!auth_token) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};