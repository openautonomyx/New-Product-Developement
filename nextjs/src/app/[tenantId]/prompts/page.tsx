'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Copy, 
  Edit, 
  MoreHorizontal,
  MessageSquare,
  Code,
  FileText,
  Sparkles
} from 'lucide-react';

const prompts = [
  { 
    id: '1', 
    name: 'Research Agent', 
    description: 'Market research and competitive analysis',
    agent: 'research',
    category: 'research',
    template: `You are a Research Agent. Analyze the market for {product}. 

Provide:
1. Market size and growth
2. Key competitors
3. User pain points
4. Opportunities

Use web search and data analysis.`,
    variables: ['product'],
  },
  { 
    id: '2', 
    name: 'PM Specification', 
    description: 'Create product requirement documents',
    agent: 'pm',
    category: 'product',
    template: `You are a Product Manager. Create a PRD for {feature}.

Include:
1. Problem statement
2. Success metrics
3. User stories
4. Technical considerations
5. Timeline`,
    variables: ['feature'],
  },
  { 
    id: '3', 
    name: 'Code Review', 
    description: 'Review pull requests',
    agent: 'engineering',
    category: 'engineering',
    template: `Review this code change:

```{language}
{code}
```

Focus on:
1. Security issues
2. Performance
3. Code quality
4. Test coverage`,
    variables: ['code', 'language'],
  },
  { 
    id: '4', 
    name: 'Test Generation', 
    description: 'Generate unit tests',
    agent: 'qa',
    category: 'testing',
    template: `Generate unit tests for:

```{language}
{code}
```

Use {framework}. Cover edge cases.`,
    variables: ['code', 'language', 'framework'],
  },
  { 
    id: '5', 
    name: 'Marketing Copy', 
    description: 'Generate marketing content',
    agent: 'gtm',
    category: 'marketing',
    template: `Write marketing copy for {product}.

Tone: {tone}
Platform: {platform}

Include benefit-driven headlines and CTAs.`,
    variables: ['product', 'tone', 'platform'],
  },
  { 
    id: '6', 
    name: 'Sales Email', 
    description: 'Personalized outreach emails',
    agent: 'sales',
    category: 'sales',
    template: `Write a cold email to { prospect } at { company }.

Their pain points: {pain_points}
Our solution: {solution}`,
    variables: ['prospect', 'company', 'pain_points', 'solution'],
  },
  { 
    id: '7', 
    name: 'Customer Support', 
    description: 'Support response templates',
    agent: 'cs',
    category: 'support',
    template: `Reply to customer ticket:

Issue: {issue}
Customer: {customer_name}

Apologize, explain the fix, offer {compensation}.`,
    variables: ['issue', 'customer_name', 'compensation'],
  },
];

const categories = [
  { id: 'all', label: 'All', icon: MessageSquare },
  { id: 'research', label: 'Research', icon: Search },
  { id: 'product', label: 'Product', icon: FileText },
  { id: 'engineering', label: 'Engineering', icon: Code },
  { id: 'testing', label: 'Testing', icon: Sparkles },
  { id: 'marketing', label: 'Marketing', icon: MessageSquare },
  { id: 'sales', label: 'Sales', icon: MessageSquare },
  { id: 'support', label: 'Support', icon: MessageSquare },
];

export default function PromptsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = prompts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const copyPrompt = (id: string) => {
    navigator.clipboard.writeText(prompts.find(p => p.id === id)?.template || '');
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prompt Catalog</h1>
          <p className="text-muted-foreground">Manage agent prompts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" />
          New Prompt
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
          />
        </div>
        <div className="flex gap-2">
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

      {/* Prompts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((prompt) => (
          <div 
            key={prompt.id}
            className="p-4 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{prompt.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
              </div>
              <button className="p-1 hover:bg-accent rounded-md">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 p-2 rounded bg-muted text-xs font-mono max-h-24 overflow-hidden">
              {prompt.template.substring(0, 150)}...
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-accent">
                {prompt.agent}
              </span>
              {prompt.template.includes('{') && (
                <span className="text-xs px-2 py-1 rounded bg-muted">
                  {prompt.variables.length} vars
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button 
                onClick={() => copyPrompt(prompt.id)}
                className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent rounded"
              >
                <Copy className="h-3 w-3" />
                {copied === prompt.id ? 'Copied!' : 'Copy'}
              </button>
              <button className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent rounded">
                <Edit className="h-3 w-3" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}