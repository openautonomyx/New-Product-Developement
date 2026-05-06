import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// API KEYS API - /api/api-keys
// =============================================================================

// GET /api/api-keys - List API keys
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const keys = [
    { id: 'key_001', name: 'Production', prefix: 'sk_live_****', last_used: '2 min ago', created: '2024-01-15', expires: '2025-01-15' },
    { id: 'key_002', name: 'Development', prefix: 'sk_test_****', last_used: '1 hour ago', created: '2024-02-01', expires: '2024-12-31' },
  ];

  return NextResponse.json({ keys });
}

// POST /api/api-keys - Create API key
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, permissions, expires_in_days } = await request.json();
  
  const key = `sk_${uuidv4().replace(/-/g, '')}`;
  
  const apiKey = {
    id: `key_${Date.now()}`,
    name,
    key, // Full key shown only once
    prefix: key.substring(0, 8) + '****',
    permissions: permissions || ['read'],
    expires: expires_in_days ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000).toISOString() : null,
    created_at: new Date().toISOString(),
  };

  return NextResponse.json({ apiKey }, { status: 201 });
}

// DELETE /api/api-keys - Revoke key
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  
  return NextResponse.json({ success: true, id });
}