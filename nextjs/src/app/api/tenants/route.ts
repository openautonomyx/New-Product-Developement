import { NextResponse } from 'next/server';

// GET /api/tenants - List tenants
export async function GET(request: Request) {
  const tenantId = request.headers.get('x-tenant-id');
  if (!tenantId) {
    return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
  }
  
  // Return filtered tenants (or all for admin)
  return NextResponse.json({ 
    tenants: [{ tenant_id: tenantId, name: 'Demo', plan: 'starter' }] 
  });
}

// POST /api/tenants - Create tenant
export async function POST(request: Request) {
  const { name, domain, plan } = await request.json();
  return NextResponse.json({ 
    tenant: { tenant_id: 'new_tenant', name, domain, plan: plan || 'starter' } 
  });
}