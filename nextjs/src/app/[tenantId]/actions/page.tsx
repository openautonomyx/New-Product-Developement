'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Activity,
  Bot,
  Database,
  MessageSquare
} from 'lucide-react';

const actions = [
  { 
    id: '1', 
    type: 'agent_run',
    agent: 'Research',
    action: 'Market analysis for Q2',
    status: 'completed',
    duration: '12s',
    user: 'John Doe',
    timestamp: '2024-03-10T10:30:00',
  },
  { 
    id: '2', 
    type: 'agent_run',
    agent: 'Engineering',
    action: 'Build Stripe integration',
    status: 'in_progress',
    duration: '45s',
    user: 'Sarah Smith',
    timestamp: '2024-03-10T10:45:00',
  },
  { 
    id: '3', 
    type: 'db_query',
    agent: '-',
    action: 'SELECT * FROM users WHERE tenant_id = ?',
    status: 'completed',
    duration: '0.1s',
    user: 'System',
    timestamp: '2024-03-10T10:46:00',
  },
  { 
    id: '4', 
    type: 'agent_run',
    agent: 'PM',
    action: 'Update roadmap Q2',
    status: 'completed',
    duration: '8s',
    user: 'Mike Wilson',
    timestamp: '2024-03-10T10:50:00',
  },
  { 
    id: '5', 
    type: 'message',
    agent: 'Research → PM',
    action: 'Market data shared',
    status: 'completed',
    duration: '0.2s',
    user: 'System',
    timestamp: '2024-03-10T10:51:00',
  },
  { 
    id: '6', 
    type: 'agent_run',
    agent: 'QA',
    action: 'Run test suite',
    status: 'failed',
    duration: '120s',
    user: 'Emily Brown',
    timestamp: '2024-03-10T11:00:00',
  },
  { 
    id: '7', 
    type: 'api_call',
    agent: '-',
    action: 'POST /api/v1/auth/login',
    status: 'completed',
    duration: '0.3s',
    user: 'david@acme.com',
    timestamp: '2024-03-10T11:05:00',
  },
  { 
    id: '8', 
    type: 'agent_run',
    agent: 'Sales',
    action: 'Generate outreach list',
    status: 'completed',
    duration: '25s',
    user: 'David Lee',
    timestamp: '2024-03-10T11:15:00',
  },
  { 
    id: '9', 
    type: 'retry',
    agent: 'QA',
    action: 'Retry test suite',
    status: 'in_progress',
    duration: '15s',
    user: 'System',
    timestamp: '2024-03-10T11:30:00',
  },
];

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  in_progress: { icon: Play, color: 'text-blue-600', bg: 'bg-blue-100' },
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
};

const typeConfig = {
  agent_run: { icon: Bot, label: 'Agent' },
  db_query: { icon: Database, label: 'Database' },
  message: { icon: MessageSquare, label: 'Message' },
  api_call: { icon: Activity, label: 'API' },
  retry: { icon: RotateCcw, label: 'Retry' },
};

const types = ['all', 'agent_run', 'db_query', 'message', 'api_call', 'retry'];
const statuses = ['all', 'completed', 'failed', 'in_progress', 'pending'];

export default function ActionLogPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filtered = actions.filter(a => {
    const matchSearch = a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.agent.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || a.type === selectedType;
    const matchStatus = selectedStatus === 'all' || a.status === selectedStatus;
    return matchSearch && matchType && matchStatus;
  });

  const totalActions = actions.length;
  const completedActions = actions.filter(a => a.status === 'completed').length;
  const failedActions = actions.filter(a => a.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Action Log</h1>
          <p className="text-muted-foreground">Audit trail of all agent actions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-md">
          <RotateCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Total Actions</p>
          <p className="text-2xl font-bold">{totalActions}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedActions}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Failed</p>
          <p className="text-2xl font-bold text-red-600">{failedActions}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">
            {actions.filter(a => a.status === 'in_progress').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
          />
        </div>
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background"
        >
          {types.map(t => (
            <option key={t} value={t}>
              {typeConfig[t as keyof typeof typeConfig]?.label || t}
            </option>
          ))}
        </select>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Actions Table */}
      <div className="rounded-lg border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Agent</th>
              <th className="p-4 font-medium">Action</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Duration</th>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((action) => {
              const status = statusConfig[action.status as keyof typeof statusConfig];
              const StatusIcon = status?.icon || Clock;
              const type = typeConfig[action.type as keyof typeof typeConfig];
              const TypeIcon = type?.icon || Activity;
              return (
                <tr key={action.id} className="border-b hover:bg-accent/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm capitalize">{type?.label || action.type}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{action.agent}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{action.action}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status?.bg} ${status?.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {action.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-mono">{action.duration}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{action.user}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}