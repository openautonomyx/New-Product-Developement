'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter,
  Calendar,
  User,
  Tag,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const decisions = [
  { 
    id: '1', 
    title: 'Adopt microservices over monolith', 
    context: 'Initial architecture decision for scalability',
    decision: 'Use microservices with Kubernetes',
    status: 'approved',
    author: 'John Doe',
    voted: 8,
    opposed: 1,
    date: '2024-01-15',
    tags: ['architecture', 'infrastructure'],
  },
  { 
    id: '2', 
    title: 'Use PostgreSQL as primary database', 
    context: 'Database selection for main data store',
    decision: 'PostgreSQL with read replicas',
    status: 'approved',
    author: 'Sarah Smith',
    voted: 9,
    opposed: 0,
    date: '2024-01-20',
    tags: ['database', 'storage'],
  },
  { 
    id: '3', 
    title: 'Implement JWT authentication', 
    context: 'Auth strategy for multi-tenant app',
    decision: 'JWT with refresh tokens, short expiry',
    status: 'approved',
    author: 'Mike Wilson',
    voted: 7,
    opposed: 2,
    date: '2024-02-01',
    tags: ['security', 'auth'],
  },
  { 
    id: '4', 
    title: 'Use Stripe for billing', 
    context: 'Payment processing solution',
    decision: 'Stripe with Lago integration',
    status: 'approved',
    author: 'Emily Brown',
    voted: 10,
    opposed: 0,
    date: '2024-02-10',
    tags: ['billing', 'payments'],
  },
  { 
    id: '5', 
    title: 'Adopt Next.js for frontend', 
    context: 'Frontend framework selection',
    decision: 'Next.js 14 with App Router',
    status: 'approved',
    author: 'David Lee',
    voted: 6,
    opposed: 3,
    date: '2024-02-15',
    tags: ['frontend', 'react'],
  },
  { 
    id: '6', 
    title: 'Use CrewAI for agents', 
    context: 'Multi-agent orchestration',
    decision: 'Custom implementation over CrewAI',
    status: 'rejected',
    author: 'John Doe',
    voted: 2,
    opposed: 7,
    date: '2024-03-01',
    tags: ['ai', 'agents'],
  },
  { 
    id: '7', 
    title: 'SOC2 certification target', 
    context: 'Security compliance requirements',
    decision: 'Target SOC2 Type II by Q4',
    status: 'pending',
    author: 'Sarah Smith',
    voted: 0,
    opposed: 0,
    date: '2024-03-10',
    tags: ['compliance', 'security'],
  },
];

const statusColors = {
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const tags = ['all', 'architecture', 'infrastructure', 'database', 'storage', 'security', 'auth', 'billing', 'payments', 'frontend', 'react', 'ai', 'agents', 'compliance'];

export default function DecisionsPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const filtered = decisions.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.context.toLowerCase().includes(search.toLowerCase());
    const matchTag = selectedTag === 'all' || d.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Decision Log</h1>
          <p className="text-muted-foreground">Track architectural and product decisions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" />
          New Decision
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{decisions.length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {decisions.filter(d => d.status === 'approved').length}
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {decisions.filter(d => d.status === 'rejected').length}
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {decisions.filter(d => d.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search decisions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
          />
        </div>
        <select 
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background"
        >
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {filtered.map((decision) => (
          <div 
            key={decision.id}
            className="p-4 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{decision.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[decision.status as keyof typeof statusColors]}`}>
                    {decision.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{decision.context}</p>
                <div className="mt-2 p-2 rounded bg-muted text-sm">
                  <strong>Decision:</strong> {decision.decision}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{decision.voted}</span>
                  <ThumbsDown className="h-4 w-4 text-red-600 ml-2" />
                  <span className="text-sm">{decision.opposed}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{decision.date}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {decision.author}
              </div>
              <div className="flex items-center gap-2">
                {decision.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-accent text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}