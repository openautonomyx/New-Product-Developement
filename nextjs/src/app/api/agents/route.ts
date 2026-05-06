import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// =============================================================================
// AGENTS API - /api/agents
// =============================================================================

// GET /api/agents - List agents
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tenant_id = (session.user as any).tenant_id;
  
  const agents = [
    { id: 'agent_001', name: 'Research', status: 'active', phase: 'research', tasks: 12 },
    { id: 'agent_002', name: 'PM', status: 'active', phase: 'spec', tasks: 8 },
    { id: 'agent_003', name: 'Engineering', status: 'active', phase: 'build', tasks: 15 },
    { id: 'agent_004', name: 'QA', status: 'idle', phase: 'test', tasks: 0 },
    { id: 'agent_005', name: 'GTM', status: 'idle', phase: 'launch', tasks: 0 },
    { id: 'agent_006', name: 'Sales', status: 'idle', phase: 'launch', tasks: 0 },
    { id: 'agent_007', name: 'Customer Success', status: 'idle', phase: 'iterate', tasks: 0 },
  ];

  return NextResponse.json({ agents });
}

// POST /api/agents - Create agent
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, prompt, tools } = await request.json();
  
  const agent = {
    id: `agent_${Date.now()}`,
    name,
    status: 'inactive',
    phase: 'custom',
    prompt: prompt || '',
    tools: tools || [],
    created_at: new Date().toISOString(),
  };

  return NextResponse.json({ agent }, { status: 201 });
}