import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// =============================================================================
// USERS API - /api/users
// =============================================================================

// GET /api/users - List users
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tenant_id = (session.user as any).tenant_id;
  const users = [
    { id: 'usr_001', name: 'Admin', email: 'admin@acme.com', role: 'admin', status: 'active' },
    { id: 'usr_002', name: 'Operator', email: 'operator@acme.com', role: 'operator', status: 'active' },
    { id: 'usr_003', name: 'Viewer', email: 'viewer@acme.com', role: 'viewer', status: 'active' },
  ];

  return NextResponse.json({ users });
}

// POST /api/users - Invite user
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, name, role } = await request.json();
  
  const user = {
    id: `usr_${Date.now()}`,
    email,
    name,
    role: role || 'viewer',
    status: 'pending',
    invited_at: new Date().toISOString(),
  };

  return NextResponse.json({ user }, { status: 201 });
}