'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Play, 
  Settings,
  Trash2,
  Copy,
  Zap,
  Puzzle,
  Database,
  Cloud,
  Shield,
  LineChart,
  MessageSquare,
  Webhook,
  Code,
  FlaskConical
} from 'lucide-react';

const skills = [
  { 
    id: '1', 
    name: 'Web Search', 
    description: 'Search the web for current information',
    icon: Search,
    status: 'active',
    usage: 1240,
    category: 'data',
  },
  { 
    id: '2', 
    name: 'Code Interpreter', 
    description: 'Execute Python/JS code safely',
    icon: Code,
    status: 'active',
    usage: 890,
    category: 'execution',
  },
  { 
    id: '3', 
    name: 'Vector Search', 
    description: 'Semantic search with embeddings',
    icon: Database,
    status: 'active',
    usage: 654,
    category: 'data',
  },
  { 
    id: '4', 
    name: 'API Client', 
    description: 'Call external HTTP APIs',
    icon: Cloud,
    status: 'active',
    usage: 432,
    category: 'integration',
  },
  { 
    id: '5', 
    name: 'Webhook', 
    description: 'Send webhooks to external services',
    icon: Webhook,
    status: 'active',
    usage: 321,
    category: 'integration',
  },
  { 
    id: '6', 
    name: 'Code Review', 
    description: 'Automated code review',
    icon: FlaskConical,
    status: 'active',
    usage: 210,
    category: 'qa',
  },
  { 
    id: '7', 
    name: 'Analytics', 
    description: 'Track metrics and events',
    icon: LineChart,
    status: 'active',
    usage: 189,
    category: 'monitoring',
  },
  { 
    id: '8', 
    name: 'Security Scan', 
    description: 'Scan for vulnerabilities',
    icon: Shield,
    status: 'inactive',
    usage: 0,
    category: 'security',
  },
  { 
    id: '9', 
    name: 'LLM Fallback', 
    description: 'Handle LLM API failures',
    icon: MessageSquare,
    status: 'active',
    usage: 156,
    category: 'resilience',
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'data', label: 'Data' },
  { id: 'execution', label: 'Execution' },
  { id: 'integration', label: 'Integration' },
  { id: 'qa', label: 'QA' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'security', label: 'Security' },
  { id: 'resilience', label: 'Resilience' },
];

export default function SkillsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalUsage = skills.reduce((sum, s) => sum + s.usage, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skill Catalog</h1>
          <p className="text-muted-foreground">Configure agent capabilities</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Total Skills</p>
          <p className="text-2xl font-bold">{skills.length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold">{skills.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Total Executions</p>
          <p className="text-2xl font-bold">{totalUsage.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-2xl font-bold">{categories.length - 1}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === cat.id 
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-accent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => (
          <div 
            key={skill.id}
            className="p-4 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <skill.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs ${
                skill.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {skill.status}
              </span>
              <span className="text-sm text-muted-foreground">
                {skill.usage.toLocaleString()} uses
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 border-t pt-3">
              <button className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent rounded">
                <Play className="h-3 w-3" />
                Test
              </button>
              <button className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent rounded">
                <Settings className="h-3 w-3" />
                Config
              </button>
              <button className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent rounded ml-auto">
                <Trash2 className="h-3 w-3 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}