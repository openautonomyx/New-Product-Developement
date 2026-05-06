'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Play, 
  Settings,
  Trash2,
  Link,
  Globe,
  Database,
  Mail,
  MessageSquare,
  FileText,
  Terminal,
  Cloud,
  Api,
  Key,
  Gauge,
  Clock
} from 'lucide-react';

const tools = [
  { 
    id: '1', 
    name: 'HTTP Client', 
    description: 'Make HTTP requests to any API',
    icon: Globe,
    status: 'active',
    rateLimit: 1000,
    category: 'api',
  },
  { 
    id: '2', 
    name: 'PostgreSQL', 
    description: 'Query and update PostgreSQL databases',
    icon: Database,
    status: 'active',
    rateLimit: 500,
    category: 'database',
  },
  { 
    id: '3', 
    name: 'SMTP', 
    description: 'Send emails via SMTP',
    icon: Mail,
    status: 'active',
    rateLimit: 100,
    category: 'notification',
  },
  { 
    id: '4', 
    name: 'Slack', 
    description: 'Send messages to Slack channels',
    icon: MessageSquare,
    status: 'active',
    rateLimit: 200,
    category: 'notification',
  },
  { 
    id: '5', 
    name: 'File System', 
    description: 'Read/write local files',
    icon: FileText,
    status: 'active',
    rateLimit: -1,
    category: 'filesystem',
  },
  { 
    id: '6', 
    name: 'Bash', 
    description: 'Execute shell commands',
    icon: Terminal,
    status: 'active',
    rateLimit: 50,
    category: 'execution',
  },
  { 
    id: '7', 
    name: 'S3 Storage', 
    description: 'AWS S3 object storage',
    icon: Cloud,
    status: 'active',
    rateLimit: 1000,
    category: 'storage',
  },
  { 
    id: '8', 
    name: 'OpenAI', 
    description: 'GPT models via OpenAI API',
    icon: Api,
    status: 'active',
    rateLimit: 500,
    category: 'ai',
  },
  { 
    id: '9', 
    name: 'Anthropic', 
    description: 'Claude models via Anthropic API',
    icon: Api,
    status: 'active',
    rateLimit: 500,
    category: 'ai',
  },
  { 
    id: '10', 
    name: 'Auth0', 
    description: 'Authentication via Auth0',
    icon: Key,
    status: 'inactive',
    rateLimit: 0,
    category: 'auth',
  },
  { 
    id: '11', 
    name: 'Redis', 
    description: 'In-memory cache',
    icon: Database,
    status: 'active',
    rateLimit: -1,
    category: 'cache',
  },
  { 
    id: '12', 
    name: 'Rate Limiter', 
    description: 'Custom rate limiting',
    icon: Gauge,
    status: 'active',
    rateLimit: -1,
    category: 'middleware',
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'api', label: 'API' },
  { id: 'database', label: 'Database' },
  { id: 'notification', label: 'Notification' },
  { id: 'filesystem', label: 'File System' },
  { id: 'execution', label: 'Execution' },
  { id: 'storage', label: 'Storage' },
  { id: 'ai', label: 'AI' },
  { id: 'auth', label: 'Auth' },
  { id: 'cache', label: 'Cache' },
  { id: 'middleware', label: 'Middleware' },
];

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = tools.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tool Catalog</h1>
          <p className="text-muted-foreground">Manage agent tools and integrations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" />
          Add Tool
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Total Tools</p>
          <p className="text-2xl font-bold">{tools.length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold">{tools.filter(t => t.status === 'active').length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">API Tools</p>
          <p className="text-2xl font-bold">{tools.filter(t => t.category === 'ai').length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Integrations</p>
          <p className="text-2xl font-bold">{categories.length - 3}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <div 
            key={tool.id}
            className="p-4 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <tool.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs ${
                tool.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {tool.status}
              </span>
              <span className="text-sm text-muted-foreground">
                {tool.rateLimit === -1 ? 'Unlimited' : `${tool.rateLimit}/min`}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-accent">
                {tool.category}
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
                <Link className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}