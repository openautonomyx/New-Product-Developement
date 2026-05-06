import { NextResponse } from 'next/server';

// =============================================================================
// USAGE API - /api/usage
// =============================================================================

// GET /api/usage - Get usage stats
export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const usage = {
    calls: { used: 45200, limit: 50000, reset_at: '2024-04-01' },
    agent_runs: { used: 3840, limit: 5000 },
    storage_gb: { used: 2.4, limit: 10 },
    team_members: { used: 12, limit: 50 },
    current_period: {
      start: '2024-03-01',
      end: '2024-03-31',
      cost: 89.50,
    },
    history: [
      { month: '2024-03', calls: 45200, cost: 89.50 },
      { month: '2024-02', calls: 38400, cost: 76.80 },
      { month: '2024-01', calls: 42100, cost: 84.20 },
    ],
  };

  return NextResponse.json({ usage });
}