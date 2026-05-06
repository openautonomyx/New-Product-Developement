import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// =============================================================================
// TASKS API - /api/tasks
// =============================================================================

// GET /api/tasks - List tasks
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const agent = searchParams.get('agent');

  const tasks = [
    { id: 'task_001', title: 'Build Stripe integration', agent: 'Engineering', status: 'in_progress', priority: 'high', updated: '2 min ago' },
    { id: 'task_002', title: 'Market analysis report', agent: 'Research', status: 'completed', priority: 'medium', updated: '1 hour ago' },
    { id: 'task_003', title: 'User authentication', agent: 'Engineering', status: 'completed', priority: 'high', updated: '3 hours ago' },
    { id: 'task_004', title: 'Q2 Roadmap planning', agent: 'PM', status: 'in_progress', priority: 'medium', updated: '5 hours ago' },
    { id: 'task_005', title: 'Write unit tests', agent: 'QA', status: 'pending', priority: 'high', updated: '1 day ago' },
  ];

  return NextResponse.json({ tasks });
}

// POST /api/tasks - Create task
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, agent, priority } = await request.json();
  
  const task = {
    id: `task_${Date.now()}`,
    title,
    description,
    agent,
    status: 'pending',
    priority: priority || 'medium',
    created_at: new Date().toISOString(),
  };

  return NextResponse.json({ task }, { status: 201 });
}

// PATCH /api/tasks - Update task status
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status } = await request.json();
  
  return NextResponse.json({ 
    task: { id, status, updated_at: new Date().toISOString() } 
  });
}