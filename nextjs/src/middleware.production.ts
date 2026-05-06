import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// =============================================================================
// PRODUCTION SECURITY MIDDLEWARE
// =============================================================================

// Security headers (immutable)
const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

// CSP (Content Security Policy)
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires this
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

// Rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; reset: number }>();
const MAX_REQUESTS_PER_MINUTE = 60;

// CSRF-safe methods
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getClientIP(request: NextRequest): string {
  return request.ip || 
         request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') ||
         'unknown';
}

function getTenant(request: NextRequest): string | null {
  // From header, subdomain, or path
  const hostname = request.nextUrl.hostname;
  const path = request.nextUrl.pathname;
  
  // Subdomain: tenant.example.com
  if (!hostname.includes('localhost') && hostname.includes('.')) {
    return hostname.split('.')[0];
  }
  
  // Path: /acme/dashboard
  const parts = path.split('/').filter(Boolean);
  return parts[0] || null;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (!entry || entry.reset < now) {
    rateLimitStore.set(ip, { count: 1, reset: now + 60000 });
    return true;
  }
  
  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  entry.count++;
  return true;
}

function validateTenant(request: NextRequest, tenantId: string): boolean {
  const headerTenant = request.headers.get('x-tenant-id');
  return headerTenant === tenantId;
}

// =============================================================================
// MIDDLEWARE
// =============================================================================

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // =============================================================================
  // 1. Skip static/health checks
  // =============================================================================
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/health') ||
    pathname === '/health' ||
    pathname === '/favicon.ico')
  ) {
    return response;
  }

  // =============================================================================
  // 2. Apply security headers
  // =============================================================================
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  response.headers.set('Content-Security-Policy', CSP);

  // =============================================================================
  // 3. Rate limiting (exclude auth endpoints)
  // =============================================================================
  if (!pathname.startsWith('/api/auth/')) {
    const ip = getClientIP(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }

  // =============================================================================
  // 4. Tenant isolation
  // =============================================================================
  const tenantId = getTenant(request);
  if (tenantId) {
    response.headers.set('x-tenant-id', tenantId);
  }

  // =============================================================================
  // 5. CSRF protection (state-changing methods)
  // =============================================================================
  if (!SAFE_METHODS.includes(request.method)) {
    const csrf = request.headers.get('x-csrf-token');
    const nonce = request.headers.get('x-nonce');
    
    if (!csrf && !nonce) {
      return NextResponse.json(
        { error: 'CSRF token required' },
        { status: 403, headers: { 'X-CSRF-Required': 'true' } }
      );
    }
  }

  // =============================================================================
  // 6. Authentication check for API routes
  // =============================================================================
  if (pathname.startsWith('/api/') && !pathname.includes('/auth/')) {
    const auth = request.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      // Allow unauth'd usage endpoints
      if (!pathname.includes('/usage') && !pathname.includes('/webhooks')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
  }

  // =============================================================================
  // 7. Tenant access validation
  // =============================================================================
  if (tenantId) {
    const tenantHeader = request.headers.get('x-tenant-id');
    if (tenantHeader && !validateTenant(request, tenantId)) {
      return NextResponse.json(
        { error: 'Tenant access denied' },
        { status: 403 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};