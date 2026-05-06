import { NextResponse } from 'next/server';

// =============================================================================
// WEBHOOKS API - /api/webhooks
// =============================================================================

// GET /api/webhooks - List webhooks
export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const webhooks = [
    { id: 'wh_001', url: 'https://acme.com/webhook', events: ['task.completed'], status: 'active', last_triggered: '2 min ago' },
    { id: 'wh_002', url: 'https://acme.com/slack', events: ['agent.error'], status: 'active', last_triggered: '1 hour ago' },
  ];

  return NextResponse.json({ webhooks });
}

// POST /api/webhooks - Register webhook
export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url, events, secret } = await request.json();
  
  if (!url || !events?.length) {
    return NextResponse.json(
      { error: 'URL and events required' },
      { status: 400 }
    );
  }

  const webhook = {
    id: `wh_${Date.now()}`,
    url,
    events,
    status: 'active',
    secret: secret || `whsec_${Math.random().toString(36).substring(2)}`,
    created_at: new Date().toISOString(),
  };

  return NextResponse.json({ webhook }, { status: 201 });
}

// DELETE /api/webhooks - Remove webhook
export async function DELETE(request: Request) {
  const auth = request.headers.get('authorization');
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  
  return NextResponse.json({ success: true, id });
}

// Webhook delivery endpoint (external)
export async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const event = searchParams.get('event');

  if (!id || !event) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }

  // Process webhook
  console.log(`Webhook ${id} triggered: ${event}`);
  
  return NextResponse.json({ received: true });
}